const { IA } = require("#Classes/IA");

class TwitchInteractions {

    constructor(bot, channels) {

        this.messageHistory = [];
        this.bot = bot;
        this.channels = channels;

    }

    async startup() {
        await IA.startup(this.bot, this.channels);
    }

    async onMessage(channel, username, message) {
        await IA.addMessage(channel, username, message);
        await IA.getGPTResponse(channel);
    }

}

module.exports = { TwitchInteractions }