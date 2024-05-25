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

    listen(event, callback) {
        const socket = this._connectToSocketServer();
        socket.on(event, callback);
    }

    /**
     * Emmits an event from the client to the socket server
     * @param {String} event The name of the event you want to emit
     * @param {any} data The data you want to emit
     */
    emitToServer(event, data) {
        const socket = this._connectToSocketServer();
        socket.emit(event, data);
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

}

const Socket = new SocketService();

module.exports = { Socket };