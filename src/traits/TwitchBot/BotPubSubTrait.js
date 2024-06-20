const { hasValue } = require("#Helpers/helpers");
const { TwitchAPI } = require("#Classes/TwitchAPI");

const { convertStringBoolean } = require("#Helpers/helpers");

const BotPubSubTrait = {

    /**
     * Handle Pub Sub Events
     * @param {String} fullEvent The topic that was sent on the Twitch event
     * @param {JSON} data The data sent by Twitch
     */
    async handlePubSub(fullEvent, data) {

        fullEvent = fullEvent.split(".");
        const event = fullEvent.shift();
        const channelId = fullEvent.pop();

        const twitchAPI = await TwitchAPI.getInstance();
        const channel = await twitchAPI.getUserByUserId(channelId);

        const events = {
            "channel-points-channel-v1": this.rewardRedeemed.bind(this)
        }

        const exec = events[event]

        if ( hasValue(exec) )
            exec({
                id: channel.id,
                login: channel.login
            }, data.data);

    },

    /**
     * 
     * @param {Object} channel The information about the channel where the reward was redeemed
     * @param {Object} channel.id The id of the channel where the reward was redeemed
     * @param {Object} channel.login The display name of the channel where the reward was redeemed
     * @param {Object} data The data sent by Twitch
     */
    rewardRedeemed({ login }, { redemption }) {

        if (convertStringBoolean(process.env.ENABLE_BOT_REWARDS_ANNOUNCEMENTS))
            this.say(login, `${redemption.user.display_name} has redeemed ${redemption.reward.title}`);


    }

}

module.exports = { BotPubSubTrait }