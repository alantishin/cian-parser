const ParsePage = require('./src/parser/ParsePage')

const timestep = parseInt(process.env.TIME_STEP) * 1000 || 3000


setTimeout(() => {
    console.log('parse')

    ParsePage()

}, timestep)