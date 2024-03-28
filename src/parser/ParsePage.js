const _random = require('lodash/random')
const puppeteer = require('puppeteer');
const _toNumber = require('lodash/toNumber')
const { parseInt } = require('lodash');


const getBrowser = async function() {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            // '--proxy-server=192.252.215.5:16137',
            '--ignore-certificate-errors',
        ],
        ignoreDefaultArgs: ['--disable-extensions']
    });

    return browser
}


const wait = function(timeout_ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, timeout_ms)
    })
}


module.exports = async function (params) {
    const { link, timeout } = params

    console.log('get brower')
    const browser = await getBrowser()


    console.log('new page')
    const page = await browser.newPage();


    await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Accept-language': 'ru-RU',
    })


    page.setViewport({ width: 1024, height: 768 });

    console.log('page goto')
    await page.goto(link, {
        waitUntil: 'networkidle0', 
        timeout: timeout || 90000
    });

    console.log('page wait')
    await wait(_random(5, 15) * 1000)


    console.log('page screenshot')
    await page.screenshot({path: './screenshots/last_screen.png'});


    console.log('page get links')
    const links = await page.evaluate(injectFunction);

    await page.close()
    await browser.close();

    return processLinks(links);
}

const injectFunction = function () {
    var cards = document.querySelectorAll('article[data-name="CardComponent"]');
    var posts = [];

    for(const el of cards) {
        is_suggestion = el.closest('div[data-name="Suggestions"]')

        if(is_suggestion) {
            continue
        }

        var linkArea = el.querySelector('div [data-name="LinkArea"]'); 
        var a = linkArea.querySelector('a');

        posts.push({
            title: el.querySelector('[data-mark="OfferTitle"]').innerText,
            price: el.querySelector('[data-mark="MainPrice"]').innerText,
            url: a.href
        });
    }

    return posts
}

const processLinks = function(posts) {
    return posts.map(post => {
        const id = getIdfromLink(post.url)
    
        return {
            url: post.url,
            title: post.title,
            price: post.price,
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