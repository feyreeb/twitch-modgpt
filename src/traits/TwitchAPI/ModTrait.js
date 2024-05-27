const { Announcements } = require("#TwitchCommands/Announcements");
const { Ban } = require("#TwitchCommands/Ban");
const { Channel } = require("#TwitchCommands/Channel");

const ModTrait = {

    ...Announcements,
    ...Ban,
    ...Channel,

    checkIfCanPerform() {

        if (this.usingTokenFromBot)
            throw {
                type: "unauthorized"
            }

    }

}

module.exports = { ModTrait };