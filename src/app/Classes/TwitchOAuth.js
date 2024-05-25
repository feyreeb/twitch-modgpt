const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { convertStringBoolean } = require("#Helpers/helpers");

class TwitchOAuth {

    constructor() {

        if (!TwitchOAuth.instance) {

            this.authorizationUrl = "https://id.twitch.tv/oauth2/authorize";
            this.tokenUrl = "https://id.twitch.tv/oauth2/token";
            this.useBotAccountForModerationActions = convertStringBoolean(process.env.USE_BOT_ACCOUNT_FOR_MODERATION_ACTIONS);

            this.moderationScopes = [
                "channel%3Amoderate",
                "moderator%3Amanage%3Abanned_users",
                "moderation%3Aread",
                "moderator%3Amanage%3Aannouncements",
                "moderator%3Amanage%3Aautomod",
                "moderator%3Aread%3Aautomod_settings",
                "moderator%3Amanage%3Aautomod_settings",
                "moderator%3Aread%3Ablocked_terms",
                "moderator%3Amanage%3Ablocked_terms",
                "moderator%3Amanage%3Achat_messages",
                "moderator%3Aread%3Achat_settings",
                "moderator%3Amanage%3Achat_settings",
                "moderator%3Aread%3Achatters",
                "moderator%3Aread%3Afollowers",
                "moderator%3Aread%3Ashield_mode",
                "moderator%3Amanage%3Ashield_mode",
                "moderator%3Aread%3Ashoutouts",
                "moderator%3Amanage%3Ashoutouts",
                "moderator%3Aread%3Aunban_requests",
                "moderator%3Amanage%3Aunban_requests"
            ];

            TwitchOAuth.instance = this;

        }

        return TwitchOAuth.instance;

    }

    /**
     * Get the URL to authorize a Twitch account to be used as a bot
     * @returns {String} The URL to request authorization
     */
    getBotAuthorizationURL() {

        const { authorizationUrl, moderationScopes, useBotAccountForModerationActions } = this;

        const requestAuthorizationUrl = new URL(authorizationUrl);

        requestAuthorizationUrl.searchParams.append("response_type", "code");
        requestAuthorizationUrl.searchParams.append("client_id", process.env.TWITCH_BOT_CLIENT_ID);
        requestAuthorizationUrl.searchParams.append("redirect_uri", process.env.BOT_HOSTED_URL + "/get-bot-token");
        
        let scopes = [
            "chat%3Aread",
            "chat%3Aedit"
        ];

        if (useBotAccountForModerationActions)
            scopes = scopes.concat(moderationScopes);

        return requestAuthorizationUrl + "&scope=" + scopes.join("+");

    }

    /**
     * Get the URL to authorize a streamer Twitch account to perform Mod Operations
     * @returns {String} The URL to request authorization
     */
    getStreamerAuthorizationURL() {

        const { authorizationUrl, moderationScopes } = this;

        const requestAuthorizationUrl = new URL(authorizationUrl);

        requestAuthorizationUrl.searchParams.append("response_type", "code");
        requestAuthorizationUrl.searchParams.append("client_id", process.env.TWITCH_STREAMER_CLIENT_ID);
        requestAuthorizationUrl.searchParams.append("redirect_uri", process.env.BOT_HOSTED_URL + "/get-streamer-token");

        return requestAuthorizationUrl + "&scope=" + moderationScopes.join("+");

    }

    /**
     * Get and save the token of the user
     * @param {String} from Which user type is getting the token
     * @param {String} code The code responded by Twitch when application was authorized
     * @returns {Bool} Wether the token was get and saved successfully
     */
    async getAndSaveToken(from, code) {

        const { tokenUrl } = this;
        let clientId, clientSecret, redirectUri, tokenFileName;

        // First, we get who is getting and saving the token
        if (from === "bot") {
            redirectUri = "/get-bot-token";
            tokenFileName = "bot-token.json";
            clientId = process.env.TWITCH_BOT_CLIENT_ID;
            clientSecret = process.env.TWITCH_BOT_CLIENT_SECRET;

        }
        else {
            redirectUri = "/get-streamer-token";
            tokenFileName = "streamer-token.json";
            clientId = process.env.TWITCH_STREAMER_CLIENT_ID;
            clientSecret = process.env.TWITCH_STREAMER_CLIENT_SECRET;
        }

            console.log(process.env.BOT_HOSTED_URL + redirectUri);
            console.log(tokenFileName);
            console.log(clientId);
            console.log(clientSecret);

        // Then, we send the request to Twitch to get the token
        try {
            
            const response = await axios.post(tokenUrl, {
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: process.env.BOT_HOSTED_URL + redirectUri
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            // Finally, we save the token in a file
            const token = response.data;
            const tokenFile = path.resolve(tokenFileName);

            if(fs.existsSync(tokenFile)) {
                fs.writeFileSync(tokenFile, JSON.stringify(token))
            }
            else {
                const writeStream = fs.createWriteStream(tokenFile);
                writeStream.write(JSON.stringify(token));
                writeStream.end();
            }

            return true;
            
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            return false;
        }

    }

}

const OAuth = new TwitchOAuth();

module.exports = { OAuth };