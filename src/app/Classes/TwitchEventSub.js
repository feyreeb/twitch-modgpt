class TwitchEventSub {

    constructor() {

        if (!TwitchEventSub.instance) {

            this.connection = null;
            this.twitchAPI = null;
            this.sessionId = null;

            // A way to implement traits in JavaScript
            if("useTrait" in this)
                for (const trait of this.useTrait())
                    Object.assign(Object.getPrototypeOf(this), trait);

            TwitchEventSub.instance = this;

        }

        return TwitchEventSub.instance;

    }

    /**
     * Set the connection instance for the class
     * @param {Connection} connection The connection instance to the socket server
     */
    setConnection(connection) {
        this.connection = connection;
    }

    /**
     * Set the twitch API instance for the class
     * @param {String} twitchAPI An instance of Twitch API class
     */
    setTwitchAPI(twitchAPI) {
        this.twitchAPI = twitchAPI;
    }

    /**
     * Saves the session id when connect to Twitch Event Sub
     * @param {JSON} message The session id
     */
    saveSessionId(sessionId) {
        this.sessionId = sessionId;
    }
    /**
     * Subscribe events to listen from channels
     * @param {Array} channelIds The channels to listen events
     */
    subscribe(channelIds) {

        const topics = [];

        channelIds.forEach(channelId => {

            topics.push({
                type: "channel.raid",
                version: "1",
                condition: {
                    "to_broadcaster_user_id": channelId
                },
                transport: {
                    method: "websocket",
                    session_id: this.sessionId
                }
            });

        });

        topics.forEach(async topic => {
            this.twitchAPI.subscribeEventSub(topic)
        });

    }

}

module.exports = { 
    TwitchEventSub: new TwitchEventSub()
};