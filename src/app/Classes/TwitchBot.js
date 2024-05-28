const { BotInitializationTrait } = require("#Traits/TwitchBot/BotInitializationTrait");
const { BotInteractionsTrait } = require("#Traits/TwitchBot/BotInteractionsTrait");
const { BotModerationActionsTrait } = require("#Traits/TwitchBot/BotModerationActionsTrait");
const { BotPubSubTrait } = require("#Traits/TwitchBot/BotPubSubTrait");

class TwitchBotService {

    constructor() {

        if (!TwitchBotService.instance) {

            this.connection = null;
            this.botScopes = null;
            this.refreshBotToken = null;
            this.accessBotToken = null;
            this.botData = null;

            // A way to implement traits in JavaScript
            if("useTrait" in this)
                for (const trait of this.useTrait())
                    Object.assign(Object.getPrototypeOf(this), trait);

            TwitchBotService.instance = this;

        }

        return TwitchBotService.instance;

    }

    /**
     * Allows you to use traits/mixins inside this controller
     * @returns {Array} The traits/mixins you want to use
     */
    useTrait() {
        return [
            BotInitializationTrait,
            BotInteractionsTrait,
            BotModerationActionsTrait,
            BotPubSubTrait
        ];
    }

    

}

const TwitchBot = new TwitchBotService();

module.exports = { TwitchBot };