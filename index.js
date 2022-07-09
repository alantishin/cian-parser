const _random = require('lodash/random')
const path = require('path');
const { exec } = require("child_process");
const fs = require('fs')
const ParsePage = require('./src/parser/ParsePage')
const Storage = require('./src/storage/Storage')
const Bot = require('./src/bot/Bot')


const timestep = parseInt(process.env.TIME_STEP) * 1000 || 3000

const link = process.env.CIAN_LINK

const wait = function (timeout_ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(true)
        }, timeout_ms)
    })
}

const readVpnsList = function (dir) {
    return fs.readdirSync(dir)
        .filter(el => {
            return el.includes('.ovpn')
        })
        .map(el => {
            return path.resolve(path.join(dir, el));
        })
}

const activateVpn = function (filepath) {
    const command = `openvpn --daemon --config '${filepath}'`

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return reject(error)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return reject(stderr)
            }
            return resolve(stdout)
        });
    })
}

const stopVpn = function () {
    return new Promise((resolve, reject) => {
        exec("killall openvpn", (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return reject(error)
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return reject(stderr)
            }
            return resolve(stdout)
        });
    })
}

const init = async function () {
    vpns = readVpnsList('./openvpn')


    const user_ids = process.env.TELEGRAM_USER_IDS.split(',')

    while (true) {
        console.log('iteration started')

        vpnIndex = _random(0, vpns.length - 1)

        console.log(`vpn selected ${vpns[vpnIndex]}`)

        await activateVpn(vpns[vpnIndex])

        const links = await ParsePage({
            link: link
        })

        const newLinks = await Storage.filterNew({
            links: links
        })

        console.log(`parsed ${newLinks.length} new items`)

        for (const el of newLinks) {
            await Storage.saveNew(el);

            for (const user_id of user_ids) {
                pushAdv(el, user_id)
            }
        }

        console.log('iteration ending')

        // random timestamp
        await wait(timestep + (_random(5, 15) * 1000))
        await stopVpn()
    }
}

init()


const pushAdv = async function (link, user_id) {
    await Bot.sendMessage({
        token: process.env.TELEGRAM_BOT_TOKEN,
        user_id: user_id,
        text: link.fullLink
    })
}