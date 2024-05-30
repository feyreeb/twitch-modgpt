const { GPTTrait } = require("#Traits/IA/GPTTrait");

class IA {

    constructor() {

        if (!IA.instance) {

            this.assistant = null;
            this.threads = {};

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

    async startup(bot, channels) {
        await this.setAssistant(bot.login);
        await this.setThread(channels);
    }

}

module.exports = {
    IA: new IA()
}