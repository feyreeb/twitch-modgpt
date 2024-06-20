const { hasValue } = require("#Helpers/helpers");

const BotInteractionsTrait = {

    /**
     * Perform actions when we receive a message from a channel
     * @param {String} channel The Twitch channel from where the message was received
     * @param {String} username The username who sent the message
     * @param {String} message The message sent
     */
    async onMessage(channel, username, message) {

        if ( hasValue(this.twitchInteractions) ) 
            await this.twitchInteractions.onMessage(channel.substring(1).toLocaleLowerCase(), username, message);
        
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