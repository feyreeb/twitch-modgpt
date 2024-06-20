const { TwitchAPI } = require("#Classes/TwitchAPI");
const { convertStringBoolean  } = require("#Helpers/helpers");

const BotModerationActionsTrait = {

    /**
     * Get a message to request moderation actions
     * @returns {String} The message requesting moderations actions kindly
     */
    requestAuthorizationForModerationActions() {

        const from = convertStringBoolean(process.env.USE_BOT_ACCOUNT_FOR_MODERATION_ACTIONS) ? "bot" : "streamer";
    
        return `Please give me authorization to moderate your channel using the following link: ${process.env.BOT_HOSTED_URL}/auth-${from}`;

    },

    /**
     * Perform a moderation action through Twitch API
     * @param {String} channel The channel where the command will be executed
     * @param {Object} args An object with the arguments for this function
     * @returns {Promise} A return intedeed to kill the process
     */
    async performModerationActions(channel, command, args) {

        const twitchAPI = await TwitchAPI.getInstance();

        if (command in twitchAPI) {
            const exec = twitchAPI[command].bind(twitchAPI);
            return await exec(channel, args);
        }

        throw {
            type: "command_not_supported"
        }

    }


}

module.exports = { BotModerationActionsTrait };