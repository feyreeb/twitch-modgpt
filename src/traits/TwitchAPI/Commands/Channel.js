const axios = require("axios");
const { hasValue, buildURLWithParams } = require("#Helpers/helpers");

module.exports = {

    Channel: {

        /**
         * Get information about a game
         * @param {Object} getBy An object with how you will get the game information
         * @param {Number} getBy.id An ID to query the game
         * @param {String} getBy.name A name to query the game
         * @returns {Object} The game information
         */
        async _getGame({
            id = null,
            name = null,
        } = {}) {

            const {
                clientId,
                endpoints: { games },
                token: { access_token }
            } = this;
            
            try {

                const params = hasValue(id) ? { id } : { name };

                const game = await axios({
                    method: "get",
                    url: buildURLWithParams(games, params),
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'Client-Id': clientId
                    }
                });

                return game.data.data[0];
            
            } catch (error) {
                console.log(error);
            }

        },

        /**
         * Changes the game/category of a channel
         * @param {String} channel The channel whose game/category will be changed
         * @param {String} name The name of the game/category that will be setted
         */
        async game(channel, { name }) {

            this.checkIfCanPerform();

            const game = await this._getGame({ name });

            if ( hasValue(game) ) {

                const {
                    clientId,
                    endpoints: { channels },
                    token: { access_token }
                } = this;
                
                try {

                    const broadcaster = await this.getUserByUsername(channel);

                    await axios({
                        method: "patch",
                        url: buildURLWithParams(channels, {
                            broadcaster_id: broadcaster.id
                        }),
                        data: {
                            game_id: game.id
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
                
            }
            else {

                throw {
                    type: "invalid_game"
                }
            }

        },

        /**
         * Changes the game/category of a channel
         * @param {String} channel The channel whose game/category will be changed
         * @param {String} title The title of the stream that will be setted
         */
        async title(channel, { title }) {

            this.checkIfCanPerform();

            const {
                clientId,
                endpoints: { channels },
                token: { access_token }
            } = this;
            
            try {

                const broadcaster = await this.getUserByUsername(channel);

                await axios({
                    method: "patch",
                    url: buildURLWithParams(channels, {
                        broadcaster_id: broadcaster.id
                    }),
                    data: { title },
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
         * 
         * @param {String|Number} channel The channel that is sending shoutout
         * @param {Object} args The arguments for this command
         * @param {Boolean} args.fromBot Wether is the bot who is executing this command
         * @param {String|Number} args.to The channel who is receiving shoutout
         */
        async shoutout(channel, { fromBot, to }) {

            const {
                moderatorId,
                clientId,
                endpoints: { shoutouts },
                token: { access_token }
            } = this;
            
            try {

                let fromId, toId;

                if (fromBot) {
                    fromId = (await this.getUserByUsername(channel)).id;
                    toId = (await this.getUserByUsername(to)).id;
                }
                else {
                    fromId = channel;
                    toId = to;
                }

                await axios({
                    method: "post",
                    url: buildURLWithParams(shoutouts, {
                        from_broadcaster_id: fromId,
                        to_broadcaster_id: toId,
                        moderator_id: moderatorId,
                    }),
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'Client-Id': clientId
                    }
                });
            
            } catch (error) {
                console.log(error.response.data);
            }

        }

    }

}