const { Announcements } = require("#TwitchCommands/Announcements");
const { Ban } = require("#TwitchCommands/Ban");
const { Channel } = require("#TwitchCommands/Channel");
const { General } = require("#TwitchCommands/General");
const { Clips } = require("#TwitchCommands/Clips");

const ModTrait = {

    ...Announcements,
    ...Ban,
    ...Channel,
    ...Clips,
    ...General,

    checkIfCanPerform() {

        if (this.usingTokenFromBot)
            throw {
                type: "unauthorized"
            }

    }

}

module.exports = { ModTrait };