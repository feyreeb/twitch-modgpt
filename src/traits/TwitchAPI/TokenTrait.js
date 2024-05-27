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

            const moderatorInfo = await this.constructor.getUserByToken({
                token: this.token.access_token,
                clientId: this.clientId
            })

            this.moderatorId = moderatorInfo.id;
    
            return;

        }

        throw {
            type: "request_access"
        }

    },

    /**
     * Validates if the token is still valid
     */
    async validateToken() {

        const {
            endpoints: { validateToken },
            token: { access_token }
        } = this;

        try {

            const { data } = await axios({
                method: "get",
                url: validateToken,
                headers: {
                    Authorization: `OAuth ${access_token}`
                }
            });
    
            if ( isEmpty(data.client_id) )
                await this.refreshToken();

        }
        catch(error) {
            await this.refreshToken();
        }
    
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
            throw {
                type: "request_access"
            }

        this.token = token;

    },

}

module.exports = { TokenTrait };