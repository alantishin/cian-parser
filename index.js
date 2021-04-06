const ParsePage = require('./src/parser/ParsePage')
const Storage = require('./src/storage/Storage')


const timestep = parseInt(process.env.TIME_STEP) * 1000 || 3000

const link = 'https://www.cian.ru/cat.php?currency=2&deal_type=rent&engine_version=2&location%5B0%5D=191974&maxprice=30000&minprice=25000&offer_type=flat&room1=1&room2=1&type=4'


setTimeout(async () => {
    console.log('parse')

    const links = await ParsePage({
        link: link
    })

    const newLinks = await Storage.filterNew({
        links: links
    })

    

    console.log(newLinks)

}, timestep)