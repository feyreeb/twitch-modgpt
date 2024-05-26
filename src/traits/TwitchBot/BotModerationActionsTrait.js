const { TwitchAPI } = require("#Classes/TwitchAPI");
const { convertStringBoolean  } = require("#Helpers/helpers");

const BotModerationActionsTrait = {

    requestAuthorizationForModerationActions(channel) {

        const from = convertStringBoolean(process.env.USE_BOT_ACCOUNT_FOR_MODERATION_ACTIONS) ? "bot" : "streamer";
    
        this.say(channel, `Please give me authorization to moderate your channel using the following link: ${process.env.BOT_HOSTED_URL}/auth-${from}`);

    },

    async performModerationActions(channel, command) {

        const twitchAPI = await TwitchAPI.getInstance();
        this.say(channel, "Baneado bro :)");
        console.log(await twitchAPI.getUserByUsername("Read_Rizzy"));

    }


}

module.exports = { BotModerationActionsTrait };