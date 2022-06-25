const ParsePage = require('./src/parser/ParsePage')
const Storage = require('./src/storage/Storage')
const Bot = require('./src/bot/Bot')


const timestep = parseInt(process.env.TIME_STEP) * 1000 || 3000

const link =  process.env.CIAN_LINK

const init = async function() {
    const user_ids = process.env.TELEGRAM_USER_IDS.split(',')

    setInterval(async () => {
        console.log('[onInterval]')
    
        const links = await ParsePage({
            link: link
        })
    
        const newLinks = await Storage.filterNew({
            links: links
        })

        console.log(`parsed ${newLinks.length} new items`)
    
        for(const el of newLinks) {
            await Storage.saveNew(el);
    
            for( const user_id of user_ids) {
                pushAdv(el, user_id)
            }
        }
    }, timestep)
}

init()


const pushAdv = async function(link, user_id) {
    await Bot.sendMessage({
        token: process.env.TELEGRAM_BOT_TOKEN,
        user_id: user_id,
        text: link.fullLink
    })
}