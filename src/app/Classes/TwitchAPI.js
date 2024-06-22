const axios = require("axios");
const { TokenTrait } = require("#Traits/TwitchAPI/TokenTrait");
const { UserTrait } = require("#Traits/TwitchAPI/UserTrait");
const { ModTrait } = require("#Traits/TwitchAPI/ModTrait");
const { EventSubTrait } = require("#Traits/TwitchAPI/EventSubTrait");
const { convertStringBoolean  } = require("#Helpers/helpers");

class TwitchAPI {

    constructor() {

        if (!TwitchAPI.instance) {

            this.usingTokenFromBot = convertStringBoolean(process.env.USE_BOT_ACCOUNT_FOR_MODERATION_ACTIONS);
            this.from = this.usingTokenFromBot ? "bot" : "streamer";
            this.clientId = this.usingTokenFromBot ? process.env.TWITCH_BOT_CLIENT_ID : process.env.TWITCH_STREAMER_CLIENT_ID;
            this.clientSecret = this.usingTokenFromBot ? process.env.TWITCH_STREAMER_CLIENT_ID : process.env.TWITCH_STREAMER_CLIENT_SECRET;
            this.token = null;
            this.bot = null;
            this.moderatorId = null;

            this.endpoints = {
                announcements: "https://api.twitch.tv/helix/chat/announcements",
                ban: "https://api.twitch.tv/helix/moderation/bans",
                channels: "https://api.twitch.tv/helix/channels",
                clips: "https://api.twitch.tv/helix/clips",
                eventSub: "https://api.twitch.tv/helix/eventsub/subscriptions",
                games: "https://api.twitch.tv/helix/games",
                shoutouts: "https://api.twitch.tv/helix/chat/shoutouts",
                user: "https://api.twitch.tv/helix/users",
                validateToken: "https://id.twitch.tv/oauth2/validate",
            };

            // A way to implement traits in JavaScript
            if("useTrait" in this)
                for (const trait of this.useTrait())
                    Object.assign(Object.getPrototypeOf(this), trait);

            TwitchAPI.instance = this;

        }

        return TwitchAPI.instance;

    }

    /**
     * Allows you to use traits/mixins inside this controller
     * @returns {Array} The traits/mixins you want to use
     */
    useTrait() {
        return [
            TokenTrait,
            UserTrait,
            ModTrait,
            EventSubTrait,
        ];
    }

    setBot(bot) {
        this.bot = bot;
    }

    /**
     * Get an instance for this class
     * @returns {TwitchAPI} The instane of this class
     */
    static async getInstance() {
        const instance = new TwitchAPI();
        await instance.loadToken();
        return instance;
    }

    /**
     * Get an user information its token
     * @param {Object} token A token object that will containt the token where we will ge the user
     * @param {String} token.token The token itself
     * @param {String} token.clientId The Client ID associated to the token
     * @returns {Object} The user information
     */
    static async getUserByToken(token) {

        try {

            const userData = await axios({
                method: "get",
                url: "https://api.twitch.tv/helix/users",
                headers: {
                    Authorization: `Bearer ${token.token}`,
                    "Client-Id": token.clientId
                }
            });

            return userData.data.data[0];
        
        } catch (error) {
            console.log(error);
        }

    }

}

module.exports = {
    TwitchAPI
}