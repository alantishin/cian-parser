const path = require('path');
const util = require('util');
const fs = require('fs');
const readdir = util.promisify(fs.readdir)
const writeFile = util.promisify(fs.writeFile)

const dataDir = path.resolve(
    path.dirname(require.main.filename),
    'data'
)

module.exports.filterNew = async function (params) {
    const { links } = params;

    const newItems = await filterExisting(links)

    return newItems
}

module.exports.saveNew = async function (item) {
    const filename = `${item.id}.json`;

    const filePath = path.resolve(dataDir, filename)

    item.created_at = new Date().toISOString()

    await writeFile(filePath, JSON.stringify(item, null, 4))
}

const filterExisting = async function (items) {
    const files = await getJsonFiles()

    return items.filter(el => {
        const filename = `${el.id}.json`;

        return !files.includes(filename);
    })
}

const getJsonFiles = async function () {
    const files = await readdir(dataDir);

    return files.filter(el => {
        return el.includes('.json');
    })
}