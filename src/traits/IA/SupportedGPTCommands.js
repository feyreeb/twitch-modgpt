const { General } = require("#Traits/IA/functions/General");
const { Ban } = require("#Traits/IA/functions/Ban");
const { Channel } = require("#Traits/IA/functions/Channel");

module.exports = {
    SupportedGPTCommands: [
        ...General,
        ...Ban,
        ...Channel,
    ]
}