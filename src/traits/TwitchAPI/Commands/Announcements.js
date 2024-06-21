const axios = require("axios");
const { buildURLWithParams } = require("#Helpers/helpers");

module.exports = {

    Announcements: {

        /**
         * Make an announcement in the channel
         * @param {String} channel The channel where the announce will be send
         * @param {String} announcement The announcement
         * @param {String} [color=null] The color of the announcement. Posible values: "primary", "blue", "green", "orange", "purple"
         */
        async announce(channel, { announcement, color }) {

            const {
                moderatorId,
                clientId,
                endpoints: { announcements },
                token: { access_token }
            } = this;
            
            try {

                const broadcaster = await this.getUserByUsername(channel);
                const validColors = ["primary", "blue", "green", "orange", "purple"];
                const announcementColor = validColors.includes(color) ? color : "primary";

                await axios({
                    method: "post",
                    url: buildURLWithParams(announcements, {
                        broadcaster_id: broadcaster.id,
                        moderator_id: moderatorId
                    }),
                    data: {
                        message: announcement,
                        color: announcementColor
                    },
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

    }

}