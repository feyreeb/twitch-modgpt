const { Socket } = require("#Classes/Socket");
const { TwitchEventSub } = require("#Classes/TwitchEventSub");

// Get Socket instance,
const socket = new Socket("twitch_eventsub");

// Handle connections
const WakeUpEventSub = (channelIds, twitchAPI, TwitchBot) => {

    let keepAliveTime = 0;
    let countdown;

    const triggerCountdown = () => {
        countdown = setTimeout(() => {
            console.log("Connection lost to Event Sub");
        }, Number(keepAliveTime) * 1000);
    }

    socket.listen('connectFailed', error => {
        console.log("Error connecting to Twitch EventSub :(");
        console.log(error);
    });
    
    socket.listen("connect", connection => {

        // We don't need to validate token here because the bot already validated it

        console.log("Connected successfully to Twitch EventSub!");
        TwitchEventSub.setConnection(connection);
        TwitchEventSub.setTwitchAPI(twitchAPI);

        connection.on('message', message => {

            if(countdown)
                clearTimeout(countdown);
            
            const data = JSON.parse(message.utf8Data);

            switch (data.metadata.message_type) {
                case "session_welcome":
                    TwitchEventSub.saveSessionId(data.payload.session.id);
                    keepAliveTime = data.payload.session.keepalive_timeout_seconds;
                    TwitchEventSub.subscribe(channelIds);
                    break;

                case "notification":
                    TwitchBot.handleEventSub(data);
                    break;

                case "session_keepalive": break;
            
                default:
                    console.log(data);
                    break;
            }

            //triggerCountdown();

        })

    });

}

module.exports = { WakeUpEventSub }