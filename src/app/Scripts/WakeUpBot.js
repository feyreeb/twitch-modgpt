const fs = require("fs");
const path = require("path");
const { Socket } = require("#Classes/Socket");
const { TwitchBot } = require("#Classes/TwitchBot");
const { parseMessage } = require("#Helpers/twitchParser");

// Parse Channels
const channels = process.env.CHANNELS.split(",").map( channel => "#" + channel.toLowerCase() );

// Get Socket instance,
const socket = new Socket("twitch_irc");

// Handle connections
const connectBot = () => {

    socket.listen('connectFailed', error => {
        console.log("Error connecting to Twitch IRC :(");
        console.log(error);
    });
    
    socket.listen("connect", connection => {
    
        console.log("Connected successfully to Twitch IRC!");
        TwitchBot.setConnection(connection);
    
        // First, we check if we can login the bot
        const botTokenFile = path.resolve("bot-token.json");
    
        if (fs.existsSync(botTokenFile)) {
    
            const token = JSON.parse(
                fs.readFileSync(botTokenFile, { encoding: 'utf8', flag: 'r' })
            );
    
            TwitchBot.login(token.access_token, token.refresh_token);
            TwitchBot.setBotScopes(token.scope);
            
        }
        else {
            console.log("Bot token hasn't been generated yet");
        }
    
        // Then, we register bot events
        connection.on('close', () => {
            console.log('Connection Closed');
            console.log(`close description: ${connection.closeDescription}`);
            console.log(`close reason code: ${connection.closeReasonCode}`);

            if (connection.closeReasonCode == "1006") {
                console.log("Tiwtch closed connection. Reconnecting...");
                socket.resetConnection();
                connectBot();
            }

        });
    
        connection.on('message', ircMessage => {
    
            const rawIrcMessage = ircMessage.utf8Data.trimEnd();
            const messages = rawIrcMessage.split('\r\n');
    
            messages.forEach(async message => {
    
                const parsedMessage = parseMessage(message);
    
                if(!!!parsedMessage) return;
    
                switch (parsedMessage.command.command) {
    
                    case 'PRIVMSG':
                        TwitchBot.onMessage(
                            parsedMessage.command.channel,
                            parsedMessage.source.nick,
                            parsedMessage.parameters
                        );
                        break;
    
                    case 'PING':
                        connection.sendUTF('PONG ' + parsedMessage.parameters);
                        break;
    
                    case '001':
    
                        TwitchBot.configureBot();
    
                        // Successfully logged in, so join the channels.
                        channels.forEach(channel => {
                            console.log(`Joining to channel ${channel}`);
                            connection.sendUTF(`JOIN ${channel}`); 
                        });
                        break; 
    
                    /* case 'JOIN':
                        // For now we don't send an initial message
                        connection.sendUTF(`PRIVMSG #read_rizzy :asd`);
                        break; */
    
                    case 'PART':
                        console.log('The channel must have banned (/ban) the bot.');
                        connection.close();
                        break;
    
                    case 'NOTICE': 
                        
                        const reauthenticated = await TwitchBot.reauthenticateBot();
    
                        if (!reauthenticated) {
    
                            // If the authentication failed, leave the channel.
                            // The server will close the connection.
                            console.log(`Couldn't authenticate the bot. You must reauthorize the bot from ${process.env.BOT_HOSTED_URL}/auth-bot`);
    
                            channels.forEach(channel => {
                                if ('Login authentication failed' === parsedMessage.parameters) {
                                    console.log(`Authentication failed; left ${channel}`);
                                    connection.sendUTF(`PART ${channel}`);
                                }
                                else if ('You don’t have permission to perform that action' === parsedMessage.parameters) {
                                    console.log(`No permission. Check if the access token is still valid. Left ${channel}`);
                                    connection.sendUTF(`PART ${channel}`);
                                }
                            });
                            
                        }
    
                        break;
    
                }
    
            });
    
        });
    
    });

}

connectBot();