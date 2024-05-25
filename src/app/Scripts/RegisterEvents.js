import { Socket } from "#Classes/Socket";
import { TwitchBot } from "#Classes/TwitchBot";

// Handle connections

Socket.listen("connect", connection => {

    console.log("Connected successfully to Twitch IRC!");

    connection.sendUTF(`PASS ${process.env.TWITCH_BOT_ACCESS_TOKEN}`); 
    connection.sendUTF(`NICK ${account}`);

});

Socket.listen('connectFailed', error => {
    console.log("Error connecting to Twitch IRC :(");
    console.log(error);
});

