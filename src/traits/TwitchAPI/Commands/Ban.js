const axios = require("axios");
const { hasValue, buildURLWithParams } = require("#Helpers/helpers");

module.exports = {

    Ban: {

        /**
         * Timeout an user
         * @param {String} channel The channel whereto perform the action 
         * @param {Object} args The arguments for this command
         * @param {String} args.username The user that will be silenced
         * @param {Number} [args.time=60] The time in seconds to timeout the user
         * @param {String} [args.reason] The reason of the timeout
         */
        async timeout(channel, { username, time, reason }) {

            const {
                moderatorId,
                clientId,
                endpoints: { ban },
                token: { access_token }
            } = this;
            
            try {

                const broadcaster = await this.getUserByUsername(channel);
                const userToTimeout =  await this.getUserByUsername(username);

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
         * @param {String} channel The channel whereto perform the action 
         * @param {String} user The user that will be silenced
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
         * @param {String} channel The channel whereto perform the action 
         * @param {String} user The user that will be silenced
         * @param {String} [reason] The reason of the timeout
         */
        async ban(channel, args) {
            args.time = "permanent"
            this.timeout(channel, args);
        },

        /**
         * Unban an user
         * @param {String} channel The channel whereto perform the action 
         * @param {String} user The user that will be silenced
         */
        async unban(channel, username) {
            this.untimeout(channel, username);
        },
        
    }

}