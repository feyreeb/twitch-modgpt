const { Socket } = require("#Classes/Socket");

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

    setConnection(connection) {
        this.connection = connection;
    }

    setBotScopes(scopes) {
        this.botScopes = scopes;
    }

    login(accessToken, refreshToken) {
        
        const { connection } = this;

        connection.sendUTF(`PASS oauth:${accessToken}`); 
        connection.sendUTF(`NICK AnyUser`);

        this.refreshBotToken = refreshToken;

    }

    onMessage(channel, username, message) {
        console.log(`${username}: ${message}`);
        this.say(channel, message);
    }

    say(channel, message) {

        this.connection.sendUTF(`PRIVMSG ${channel} :${message}`);

    }

}

const TwitchBot = new TwitchBotService();

module.exports = { TwitchBot };