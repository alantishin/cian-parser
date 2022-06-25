const puppeteer = require('puppeteer');
const _toNumber = require('lodash/toNumber')
const _isNumber = require('lodash/isNumber');
const { parseInt } = require('lodash');


var browser = null


const getBrowser = async function() {
    if (browser) {
        return browser
    }

    browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
    });

    return browser
}

const exitHandler = async function() {
    console.log('exit')
    if (browser) {
        await browser.close();
        browser = null
        console.log('browser closed')
    }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));


module.exports = async function (params) {
    const { link, timeout } = params

    const browser = await getBrowser()

    const page = await browser.newPage();
    page.setViewport({ width: 1024, height: 768 });

    await page.goto(link, {
        waitUntil: 'load', 
        timeout: timeout || 90000
    });

    const links = await page.evaluate(injectFunction);

    await page.close()

    return processLinks(links);
}

const injectFunction = function () {
    var cards = document.querySelectorAll('article[data-name="CardComponent"]');
    var hrefs = [];

    for(const el of cards) {
        is_suggestion = el.closest('div[data-name="Suggestions"]')

        if(is_suggestion) {
            continue
        }

        var linkArea = el.querySelector('div [data-name="LinkArea"]'); 
        var a = linkArea.querySelector('a');

        hrefs.push(a.href);
    }

    return hrefs
}

const processLinks = function(links) {
    return links.map(el => {
        const id = getIdfromLink(el)
    
        return {
            fullLink: el,
            id: id ? parseInt(id) : null
        }
    })
    .filter(el => !!el.id);
}

const getIdfromLink = function (link) {
    return link.split('/')
        .find(el => {
            return el.length === _toNumber(el).toString().length
        })
}