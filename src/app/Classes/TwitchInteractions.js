const { IA } = require("#Classes/IA");

class TwitchInteractions {

    constructor(bot, channels) {
        this.bot = bot;
        this.channels = channels;
    }

    /**
     * Initializes the interactions
     */
    async startup() {
        await IA.startup(this.bot, this.channels);
    }

    /**
     * Triggers the IA to analyze the message
     * @param {String} channel The channel where the message was received
     * @param {String} username The user who sent the message
     * @param {String} message The message sent by the user
     */
    async onMessage(channel, username, message) {
        await IA.processMessage(channel, username, message);
    }

}

module.exports = { TwitchInteractions }