const { Ban } = require("#TwitchCommands/Ban");
const { Announcements } = require("#TwitchCommands/Announcements");

const ModTrait = {
    ...Ban,
    ...Announcements,
}

module.exports = { ModTrait };