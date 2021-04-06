const request = require("request");

module.exports.sendMessage = function (params) {
    const { token, user_id, text } = params

    const url = `https://api.telegram.org/bot${token}/sendMessage`

    
    return new Promise((resolve, reject) => {
        request({
            url: url,
            method: "POST",
            json: true,
            body: {
                chat_id: user_id,
                text: text
            }
        }, (error, resp, body) => {

            if(error) {
                reject(error)
            } else {
                resolve(body)
            }
        });
    })
}