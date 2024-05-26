const fs = require("fs");
const path = require("path");
const axios = require("axios");

const { isEmpty, hasValue } = require("#Helpers/helpers");
const { OAuth } = require("#Classes/TwitchOAuth");

const TokenTrait = {

    /**
     * Loads the token into the class for use in the requests
     */
    async loadToken() {

        const { usingTokenFromBot, token } = this;

        if( hasValue(token) )
            return;

        const tokenFile = usingTokenFromBot ? path.resolve("bot-token.json") : path.resolve("streamer-token.json");

        if (fs.existsSync(tokenFile)) {

            this.token = JSON.parse(
                fs.readFileSync(tokenFile, { encoding: 'utf8', flag: 'r' })
            );
    
            await this.validateToken(); 

        }

        throw new Error(`Can't connect to the API if ${from} account doesn't authorize the application from ${process.env.BOT_HOSTED_URL}/auth-${from}`);

    },

    /**
     * Validates if the token is still valid
     */
    async validateToken() {

        const {
            endpoints: { validateToken },
            token: { access_token }
        } = this;

        const { data } = await axios({
            method: "get",
            url: validateToken,
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });

        if ( isEmpty(data.client_id) )
            await this.refreshToken();
    
    },

    /**
     * Send a request to Twitch to refresh a token
     */
    async refreshToken() {

        const {
            from,
            token: { refresh_token }
        } = this;

        const { saved, token } = await OAuth.refreshToken(refresh_token, from);

        if (!saved)
            throw new Error(`Couldn't authenticate the ${from}. You must reauthorize the ${from} from ${process.env.BOT_HOSTED_URL}/auth-${from}`);

        this.token = token;

    },

}

module.exports = { TokenTrait };