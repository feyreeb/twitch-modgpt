const axios = require("axios");
const { hasValue, buildURLWithParams } = require("#Helpers/helpers");

const ModTrait = {

    /**
     * Timeout an user
     * @param  {String} channel The channel whereto perform the action 
     * @param  {String} user The user that will be silenced
     * @param  {Number} [time=60] The time in seconds to timeout the user
     * @param  {String} [reason] The reason of the timeout
     */
    async timeout(...args) {

        const {
            moderatorId,
            clientId,
            endpoints: { ban },
            token: { access_token }
        } = this;

        const channel = args.shift();
        const user = args.shift();
        const time = isNaN(parseInt(args[0])) ? null : args.shift();
        const reason = args.length > 0 ? args.join(" ") : undefined;
        
        try {

            const broadcaster = await this.getUserByUsername(channel);
            const userToTimeout =  await this.getUserByUsername(user);

            const data = {
                user_id: userToTimeout.id
            }

            if (time !== "permanent")
                data.duration = hasValue(time) ? parseInt(time) : parseInt(process.env.DEFAULT_TIMEOUT_TIME);

            if( hasValue(reason) )
                data.reason = reason;

            await axios({
                method: "post",
                url: buildURLWithParams(ban, {
                    broadcaster_id: broadcaster.id,
                    moderator_id: moderatorId
                }),
                data: { data },
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Client-Id': clientId,
                    'Content-Type': "application/json"
                }
            });
        
        } catch (error) {

            if (error.response.data.message === "The user specified in the user_id field is already banned.")
                throw {
                    type: "user_already_banned"
                }

            console.log(error.response.data);
        }

    },

    /**
     * Untimeout an user
     * @param  {String} channel The channel whereto perform the action 
     * @param  {String} user The user that will be silenced
     */
    async untimeout(channel, username) {

        const {
            moderatorId,
            clientId,
            endpoints: { ban },
            token: { access_token }
        } = this;
        
        try {

            const broadcaster = await this.getUserByUsername(channel);
            const user =  await this.getUserByUsername(username);

            await axios({
                method: "delete",
                url: buildURLWithParams(ban, {
                    broadcaster_id: broadcaster.id,
                    moderator_id: moderatorId,
                    user_id: user.id,
                }),
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    'Client-Id': clientId,
                    'Content-Type': "application/json"
                }
            });
        
        } catch (error) {
            console.log(error);
        }

    },

    /**
     * Ban an user
     * @param  {String} channel The channel whereto perform the action 
     * @param  {String} user The user that will be silenced
     * @param  {String} [reason] The reason of the timeout
     */
    async ban(...args) {
        args.splice(2, 0, "permanent");
        this.timeout(...args);
    },

    /**
     * Unban an user
     * @param  {String} channel The channel whereto perform the action 
     * @param  {String} user The user that will be silenced
     */
    async unban(channel, username) {
        this.untimeout(channel, username);
    }

}

module.exports = { ModTrait };