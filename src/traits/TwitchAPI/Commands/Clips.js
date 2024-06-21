const axios = require("axios");
const { hasValue, buildURLWithParams } = require("#Helpers/helpers");

module.exports = {

    Clips: {

        async createClip(channel, {message}) {

            const {
                clientId,
                endpoints: { clips },
                token: { access_token }
            } = this;

            const broadcaster = await this.getUserByUsername(channel);

            try {
                
                const response = await axios({
                    method: "post",
                    url: buildURLWithParams(clips, {
                        broadcaster_id: broadcaster.id
                    }),
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                        'Client-Id': clientId
                    }
                });

                this.bot.say(channel, "¡Clip creado!");
                this.bot.say(channel, `https://clips.twitch.tv/${response.data.data[0].id}`);

            } catch (error) {

                if (error.response.data.message === "Clipping is not possible for an offline channel.")
                    this.bot.say(channel, "Lo siento, no puedo hacer un clip si el streamer no está en vivo 😵‍💫.");
                else
                    this.bot.say(channel, "Lo siento, hubo un problema mientras hacía el clip :(");

                console.log(error.response.data);

            }


        }

    }

}