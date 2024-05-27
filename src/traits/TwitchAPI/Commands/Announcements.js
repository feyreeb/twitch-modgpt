const axios = require("axios");
const { buildURLWithParams } = require("#Helpers/helpers");

module.exports = {

    Announcements: {

        /**
         * Make an announcement in the channel
         * @param {String} channel The channel where the announce will be send
         * @param {String} message The announcement
         * @param {String} [color=null] The color of the announcement. Posible values: "primary", "blue", "green", "orange", "purple"
         */
        async sendAnnounce(channel, message, color = null) {

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
                        message: message,
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

        /**
         * Make an announcement in the channel with default color
         * @param {String} channel The channel where the announce will be send
         * @param {String} message The announcement
         */
        async announce(...args) {
            this.sendAnnounce(
                args.shift(),
                args.join(" ")
            );
        },

        /**
         * Make an announcement in the channel with blue color
         * @param {String} channel The channel where the announce will be send
         * @param {String} message The announcement
         */
        async announceblue(...args) {
            this.sendAnnounce(
                args.shift(),
                args.join(" "),
                "blue"
            );
        },

        /**
         * Make an announcement in the channel with green color
         * @param {String} channel The channel where the announce will be send
         * @param {String} message The announcement
         */
        async announcegreen(...args) {
            this.sendAnnounce(
                args.shift(),
                args.join(" "),
                "green"
            );
        },

        /**
         * Make an announcement in the channel with orange color
         * @param {String} channel The channel where the announce will be send
         * @param {String} message The announcement
         */
        async announceorange(...args) {
            this.sendAnnounce(
                args.shift(),
                args.join(" "),
                "orange"
            );
        },

        /**
         * Make an announcement in the channel with purple color
         * @param {String} channel The channel where the announce will be send
         * @param {String} message The announcement
         */
        async announcepurple(...args) {
            this.sendAnnounce(
                args.shift(),
                args.join(" "),
                "purple"
            );
        },

    }

}