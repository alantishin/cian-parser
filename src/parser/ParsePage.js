const puppeteer = require('puppeteer');
const _toNumber = require('lodash/toNumber')
const _isNumber = require('lodash/isNumber');
const { parseInt } = require('lodash');

const testRes = require.main.require('./mock/links.json')


module.exports = async function (params) {
    return testRes;

    const { link, timeout } = params

    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1024, height: 768 });

    await page.goto(link, {
        waitUntil: 'load', 
        timeout: timeout || 90000
    });

    const links = await page.evaluate(injectFunction);

    await browser.close();

    return processLinks(links);
}

const injectFunction = function () {
    var cards = document.querySelectorAll('article[data-name="CardComponent"]');
    var hrefs = [];

    cards.forEach(function (el) { 
        var linkArea = el.querySelector('div [data-name="LinkArea"]'); 
        var a = linkArea.querySelector('a'); 
        hrefs.push(a.href);
    })

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