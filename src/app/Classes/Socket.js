const WebSocketClient = require("websocket").client;
const { isEmpty } = require("#Helpers/helpers");

class SocketService {

    constructor() {

        if (!SocketService.instance) {

            this._socketClient = null;

            SocketService.instance = this;

        }

        return SocketService.instance;

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
            console.log("Trying to connect to Twitch IRC...");
            this._socketClient = new WebSocketClient();
            this._socketClient.connect("wss://irc-ws.chat.twitch.tv:443");
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

const Socket = new SocketService();

module.exports = { Socket };