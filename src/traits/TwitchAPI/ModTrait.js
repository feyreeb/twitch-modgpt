const axios = require("axios");
const { hasValue, buildURLWithParams } = require("#Helpers/helpers");

const ModTrait = {

    /**
     * Timeout a user
     * @param  {String} channel The channel whereto perform the action 
     * @param  {String} user The user that will be silenced
     * @param  {Number} time The time in seconds to timeout the user
     * @param  {String} reason The reason of the timeout
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
        const time = args.shift();
        const reason = args.length > 0 ? args.join(" ") : undefined;
        
        try {

            const broadcaster = await this.getUserByUsername(channel);
            const userToTimeout =  await this.getUserByUsername(user);

            const data = {
                user_id: userToTimeout.id,
                duration: Number(time)
            }

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
            console.log(error);
        }

    }

}

module.exports = { ModTrait };