const BotEventSubTrait = {

    /**
     * Handle Event Sub Events
     * @param {JSON} data The data sent by Twitch
     */
    async handleEventSub(data) {

        const event = data.metadata.subscription_type;

        const handlers = {
            "channel.raid": this.handleRaid.bind(this),
        }

        const handler = handlers[event];

        if (handler)
            handler(data.payload);
        else
            console.log("Unrecognized event");

    },

    async handleRaid(data) {

        this.say(data.event.to_broadcaster_user_name, `!so ${data.event.from_broadcaster_user_name}`);
        this.say(data.event.to_broadcaster_user_name, `¡Bienvenidos esas ${data.event.viewers} personitas al stream :D!`);

        this.twitchAPI.shoutout(data.event.to_broadcaster_user_id, {
            fromBot: false,
            to: data.event.from_broadcaster_user_id
        });

    }

}

module.exports = { BotEventSubTrait }