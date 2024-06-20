const { GPTTrait } = require("#Traits/IA/GPTTrait");

class IA {

    constructor() {

        if (!IA.instance) {

            this.assistant = null;
            this.threads = {};
            this.bot = null;

            // A way to implement traits in JavaScript
            if("useTrait" in this)
                for (const trait of this.useTrait())
                    Object.assign(Object.getPrototypeOf(this), trait);

            IA.instance = this;

        }

        return IA.instance;

    }

    useTrait() {
        return [
            GPTTrait,
        ]
    }

    /**
     * Initializes the AI
     * @param {TwitchBot} bot An instance of the bot
     * @param {Array} channels An array of channels where the bot will be used
     */
    async startup(bot, channels) {
        this.bot = bot;
        await this.setAssistant();
        await this.setThread(channels);
    }

}

module.exports = {
    IA: new IA()
}