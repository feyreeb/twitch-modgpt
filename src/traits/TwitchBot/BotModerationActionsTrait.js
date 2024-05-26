const { TwitchAPI } = require("#Classes/TwitchAPI");
const { convertStringBoolean  } = require("#Helpers/helpers");

const BotModerationActionsTrait = {

    requestAuthorizationForModerationActions(channel) {

        const from = convertStringBoolean(process.env.USE_BOT_ACCOUNT_FOR_MODERATION_ACTIONS) ? "bot" : "streamer";
    
        this.say(channel, `Please give me authorization to moderate your channel using the following link: ${process.env.BOT_HOSTED_URL}/auth-${from}`);

    },

    async performModerationActions(channel, prompt) {

        const twitchAPI = await TwitchAPI.getInstance();

        const args = prompt.slice(1).split(" ");
        const command = args.shift();

        const commands = {
            timeout: twitchAPI.timeout.bind(twitchAPI),
        }

        const exec = commands[command];
        args.unshift(channel);
        await exec(...args);

    }


}

module.exports = { BotModerationActionsTrait };