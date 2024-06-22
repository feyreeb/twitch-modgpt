const axios = require("axios");

const EventSubTrait = {

    /**
     * Subscribe to a topic of Event Sub
     * @param {JSON} topic The EventSub topic to subscribe
     */
    async subscribeEventSub(topic) {

        const {
            clientId,
            endpoints: { eventSub },
            token: { access_token }
        } = this;

        try {

            await axios({
                method: "post",
                url: eventSub,
                headers: {
                    Authorization: `Bearer ${access_token}`,
                    "Client-Id": clientId,
                    "Content-Type": "application/json"
                },
                data: topic
            });
        
        } catch (error) {
            console.log(error.response.data);
        }   

    }

}

module.exports = { EventSubTrait };