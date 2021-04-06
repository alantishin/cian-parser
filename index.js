const ParsePage = require('./src/parser/ParsePage')
const Storage = require('./src/storage/Storage')
const Bot = require('./src/bot/Bot')


const timestep = parseInt(process.env.TIME_STEP) * 1000 || 3000

const link = 'https://www.cian.ru/cat.php?currency=2&deal_type=rent&engine_version=2&location%5B0%5D=191974&maxprice=30000&minprice=25000&offer_type=flat&room1=1&room2=1&type=4'


setTimeout(async () => {
    const links = await ParsePage({
        link: link
    })

    const newLinks = await Storage.filterNew({
        links: links
    })

    newLinks.map(async (el) => {
        await Bot.sendMessage({
            token: process.env.TELEGRAM_BOT_TOKEN,
            user_id: process.env.TELEGRAM_USER_ID,
            text: el.fullLink
        })

        await Storage.saveNew(el);
    })

    

    console.log(newLinks)

}, timestep)