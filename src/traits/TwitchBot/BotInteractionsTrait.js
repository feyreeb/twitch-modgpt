const { hasValue } = require("#Helpers/helpers");

const BotInteractionsTrait = {

    /**
     * Perform actions when we receive a message from a channel
     * @param {String} channel The Twitch channel from where the message was received
     * @param {String} username The username who sent the message
     * @param {String} message The message sent
     */
    async onMessage(channel, username, message) {

        try {

            if ( hasValue(this.twitchInteractions) ) 
                await this.twitchInteractions.onMessage(channel.substring(1).toLocaleLowerCase(), username, message);

            //if (message.charAt(0) === "/")
            //if(username === "read_rizzy")
                //await this.performModerationActions(channel, "/" + message);

                /* setTimeout(async () => {
                    await this.performModerationActions(channel, "/untimeout @RetaxMaster");
                }, 2000) */
            //else 
                //this.say(channel, message);
            
        } catch (error) {

            if ( hasValue(error.type) ) {

                const errors = {
                    request_access: this.requestAuthorizationForModerationActions(channel),
                    command_not_supported: "I apologize, this command is still not supported :(",
                    user_already_banned: "I'm sorry, this user is already banned :\\",
                    invalid_game: "I'm sorry, I couldn't find that game on Twitch :(. Did you write it correctly?",
                    unauthorized: "I apologize, I can't perform that action if you are using me as moderator. If you want me to perform this action you must set your env variable USE_BOT_ACCOUNT_FOR_MODERATION_ACTIONS as false and provide your streamer credentials."
                }

                return this.say(channel, errors[error.type]);

            }

            console.log(error);

        }
        
    },

    /**
     * Tell the bot to send a message to a Twitch channel
     * @param {String} channel The Twitch channel where the bot will send the message
     * @param {String} message The message the bot will send
     */
    say(channel, message) {
        this.connection.sendUTF(`PRIVMSG #${channel} :${message}`);
    }

}

module.exports = { BotInteractionsTrait };