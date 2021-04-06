const ParsePage = require('./src/parser/ParsePage')
const Storage = require('./src/storage/Storage')
const Bot = require('./src/bot/Bot')


const timestep = parseInt(process.env.TIME_STEP) * 1000 || 3000

const link =  process.env.CIAN_LINK

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
}, timestep)