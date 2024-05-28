const { Socket } = require("#Classes/Socket");
const { TwitchPubSub } = require("#Classes/TwitchPubSub");

// Get Socket instance,
const socket = new Socket("twitch_pubsub");

// Handle connections
const WakeUpPubSub = (channelIds, accessToken, TwitchBot) => {

    socket.listen('connectFailed', error => {
        console.log("Error connecting to Twitch PubSub :(");
        console.log(error);
    });
    
    socket.listen("connect", connection => {

        // We don't need to validate token here because the bot already validated it

        console.log("Connected successfully to Twitch PubSub!");
        TwitchPubSub.setConnection(connection);
        TwitchPubSub.setAccessToken(accessToken);
        const keepAlive = TwitchPubSub.keepAlive();
        TwitchPubSub.subscribe(channelIds);

        connection.on('message', message => {

            const data = JSON.parse(message.utf8Data);

            switch (data.type) {
                case "AUTH_REVOKED":
                    clearInterval(keepAlive);
                    break;

                case "MESSAGE":
                    TwitchBot.handlePubSub(data.data.topic, JSON.parse(data.data.message));
                    break;
            
                default:
                    break;
            }

        })

    });

}

module.exports = { WakeUpPubSub }