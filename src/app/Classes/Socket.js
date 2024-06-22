const WebSocketClient = require("websocket").client;
const { isEmpty } = require("#Helpers/helpers");

class Socket {

    constructor(wsServer) {

        this._socketClient = null;

        this.availableServers = {
            twitch_irc: {
                name: "Twitch IRC",
                server: "wss://irc-ws.chat.twitch.tv:443"
            },
            twitch_pubsub: {
                name: "Twitch PubSub",
                server: "wss://pubsub-edge.twitch.tv",
            },
            twitch_eventsub: {
                name: "Twitch EventSub",
                server: "wss://eventsub.wss.twitch.tv/ws",
            }
        }

        this.server = this.availableServers[wsServer];

        if ( isEmpty(this.server) )
            throw new Error("You are trying to connect to a not supported server");

    }

    /**
     * Listen an event from the server
     * @param {Strimg} event The event you want to listen
     * @param {Function} callback The function that will be executed when the event triggers
     */
    listen(event, callback) {
        const socket = this._connectToSocketServer();
        socket.on(event, callback);
    }

    /**
     * Connects to a socket server
     * @returns {socket.io-client} The client who is connected
     */
    _connectToSocketServer() {

        if( isEmpty(this._socketClient) ) {
            console.log(`Trying to connect to ${this.server.name}...`);
            this._socketClient = new WebSocketClient();
            this._socketClient.connect(this.server.server);
        }
            
        return this._socketClient;

    }

    /**
     * Resets the connection with the server
     */
    resetConnection() {
        this._socketClient = null;
    }

}

module.exports = { Socket };