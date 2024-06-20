// Original file from: https://github.com/pedrojlazevedo/twitch-chatgpt/blob/main/keep_alive.js
const { CronJob } = require('cron');
const https = require('https');

const render_url = process.env.BOT_HOSTED_URL

if (!render_url)
    console.log("No BOT_HOSTED_URL found. Please set it as environment variable.")

const job = new CronJob('*/14 * * * *', () => {

    console.log('Making keep alive call');

    https.get(render_url, (resp) => {
        if (resp.statusCode === 200) {
            console.log("Keep alive call successful");
        } else {
            console.log("Keep alive call failed");
        }
    }).on("error", (err) => {
        console.log("Error making keep alive call");
    });

});

module.exports = { job };