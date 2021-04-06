const puppeteer = require('puppeteer');

const link = 'https://www.cian.ru/cat.php?currency=2&deal_type=rent&engine_version=2&location%5B0%5D=191974&maxprice=30000&minprice=25000&offer_type=flat&room1=1&room2=1&type=4'

module.exports = async function () {
    const browser = await puppeteer.launch({
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox'
        ],
    });
    const page = await browser.newPage();
    page.setViewport({ width: 1024, height: 768 });
    await page.goto(link);

    const links = await page.evaluate(injectFunction);

    console.log(links)


    await browser.close();
}

const injectFunction = function () {
    var cards = document.querySelectorAll('article[data-name="CardComponent"]')
    var hrefs = [];

    cards.forEach(function (el) { 
        var linkArea = el.querySelector('div [data-name="LinkArea"]'); 
        var a = linkArea.querySelector('a'); 
        hrefs.push(a.href)
    })

    return hrefs
}