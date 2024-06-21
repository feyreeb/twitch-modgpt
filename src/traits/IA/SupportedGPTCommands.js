const { General } = require("#AssistantFunctions/General");
const { Ban } = require("#AssistantFunctions/Ban");
const { Channel } = require("#AssistantFunctions/Channel");
const { Clips } = require("#AssistantFunctions/Clips");
const { Announcements } = require("#AssistantFunctions/Announcements");

module.exports = {
    SupportedGPTCommands: [
        ...Announcements,
        ...Ban,
        ...Channel,
        ...Clips,
        ...General,
    ]
}