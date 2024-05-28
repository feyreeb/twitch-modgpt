const crypto = require('crypto');

class TwitchPubSub {

    constructor() {

        if (!TwitchPubSub.instance) {

            this.connection = null;
            this.accessToken = null;

            // A way to implement traits in JavaScript
            if("useTrait" in this)
                for (const trait of this.useTrait())
                    Object.assign(Object.getPrototypeOf(this), trait);

            TwitchPubSub.instance = this;

        }

        return TwitchPubSub.instance;

    }

    /**
     * Set the connection instance for the class
     * @param {Connection} connection The connection instance to the socket server
     */
    setConnection(connection) {
        this.connection = connection;
    }

    /**
     * Set the access token for the class
     * @param {String} accessToken The token to authenticate to Twitch PubSub
     */
    setAccessToken(accessToken) {
        this.accessToken = accessToken;
    }

    /**
     * Keeps the connection alive with PubSub
     * @returns {setInterval} The habndle for the interval
     */
    keepAlive() {
        return setInterval(() => {
            this.connection.sendUTF(JSON.stringify({
                type: "PING",
            }));
        }, 4 * 60000)
    }

    /**
     * Subscribe events to listen from channels
     * @param {Array} channelIds The channels to listen events
     */
    subscribe(channelIds) {

        const topics = [];

        channelIds.forEach(channelId => {
            topics.push(`channel-points-channel-v1.${channelId}`);
        });

        this.connection.sendUTF(JSON.stringify({
            type: "LISTEN",
            nonce: crypto.randomUUID(),
            data: {
                topics: topics,
                auth_token: this.accessToken
            }
        }));

    }

}

module.exports = { 
    TwitchPubSub: new TwitchPubSub()
};