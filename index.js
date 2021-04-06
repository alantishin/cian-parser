const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ],
  });
  const page = await browser.newPage();
  page.setViewport({ width: 1024, height: 768 });
  await page.goto('https://www.cian.ru/');
  await page.screenshot({ path: 'example.png' });


  await browser.close();
})();