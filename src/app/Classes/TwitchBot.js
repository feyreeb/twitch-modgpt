const { OAuth } = require("#Classes/TwitchOAuth");

class TwitchBotService {

    constructor() {

        if (!TwitchBotService.instance) {

            this.connection = null;
            this.botScopes = null;
            this.refreshBotToken = null;

            TwitchBotService.instance = this;

        }

        return TwitchBotService.instance;

    }

    /**
     * Set the connection instance for the bot
     * @param {Connection} connection The connection instance to the socket server
     */
    setConnection(connection) {
        this.connection = connection;
    }

    /**
     * Set the scopes that this bot can use
     * @param {Array} scopes The scopes of the token
     */
    setBotScopes(scopes) {
        this.botScopes = scopes;
    }

    /**
     * Authenticate the bot in the Twitch IRC servers
     * @param {String} accessToken The access token returned by Twitch when authenticating the bot
     * @param {String} refreshToken The refresh token returned by Twitch with the acess token
     */
    login(accessToken, refreshToken) {
        
        const { connection } = this;

        connection.sendUTF(`PASS oauth:${accessToken}`); 
        connection.sendUTF(`NICK AnyUser`);

        this.refreshBotToken = refreshToken;

    }

    /**
     * Refresh the access token and reauthenticates the bot in the Twitch IRC server
     * @returns {Bool} Wether was possible to reauthentica the bot
     */
    async reauthenticateBot() {

        const { saved, token } = await OAuth.refreshToken(this.refreshBotToken, "bot");

        if (saved) {
            this.login(token.access_token, token.refresh_token);
            this.setBotScopes(token.scope);
            return true;
        }

        return false;

    }

    /**
     * Perform actions when we receive a message from a channel
     * @param {String} channel The Twitch channel from where the message was received
     * @param {String} username The username who sent the message
     * @param {String} message The message sent
     */
    onMessage(channel, username, message) {
        console.log(`${username}: ${message}`);
        this.say(channel, message);
    }

    /**
     * Tell the bot to send a message to a Twitch channel
     * @param {String} channel The Twitch channel where the bot will send the message
     * @param {String} message The message the bot will send
     */
    say(channel, message) {

        this.connection.sendUTF(`PRIVMSG ${channel} :${message}`);

    }

}

const TwitchBot = new TwitchBotService();

module.exports = { TwitchBot };