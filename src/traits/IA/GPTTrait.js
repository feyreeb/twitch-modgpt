const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const openai = new OpenAI();

const { SupportedGPTCommands } = require("#Traits/IA/SupportedGPTCommands");
const { hasValue } = require("#Helpers/helpers");

const GPTTrait = {

    /**
     * Creates the assistant and set the personality and tools that will be moderating the chat
     */
    async setAssistant() {

        const name = this.bot.botData.login;

        let instructions = fs.readFileSync(path.resolve("context.txt")).toString();
        instructions = instructions.replace(/\{\{username\}\}/g, name);

        this.assistant = await openai.beta.assistants.create({
            name: name,
            instructions: instructions,
            tools: SupportedGPTCommands,
            model: process.env.GPT_MODEL
        });

    },

    /**
     * Creates multiple conversation threads for each channel for the assistan
     * @param {String} channels An array of the channels that the assistant will be moderating
     */
    async setThread(channels) {

        for (const channel of channels)
            this.threads[channel.toLowerCase()] = await openai.beta.threads.create();

    },

    /**
     * Add a message to the corresponding thread
     * @param {String} channel The channel whereto add the message
     * @param {String} username The username who sent the message
     * @param {String} message The message to add
     * @returns {openai.beta.thread.messages} An Open AI message object
     */
    async addMessage(channel, username, message) {

        const chat = this.threads[channel];

        return await openai.beta.threads.messages.create(
            chat.id,
            {
                role: "user",
                content: `${username} dijo: ${message}`
            }
        );

    },

    /**
     * Analyzes the messages, determine an action and executes it
     * @param {String} channel The channel where the bot will respond
     */
    async getGPTResponse(channel) {

        const chat = this.threads[channel];

        const run = await openai.beta.threads.runs.create(chat.id, {
            assistant_id: this.assistant.id,
            stream: true
        });

        console.log("Running mod");
        for await (const event of run) {

            if (event.event === "thread.run.requires_action") {

                const submit = await Promise.all(
                    event.data.required_action.submit_tool_outputs.tool_calls.map(async tools => {

                        console.log(tools);

                        const commandName = tools.function.name;
                        const commandArgs = JSON.parse(tools.function.arguments);

                        if(commandName !== "nothing") {

                            try {
                                
                                if (commandName !== "say")
                                    await this.bot.performModerationActions(channel, commandName, commandArgs);
        
                                if (commandArgs.message)
                                    this.bot.say(channel, commandArgs.message);

                            } catch (error) {

                                console.log(error);
                                
                                if ( hasValue(error.type) ) {

                                    const errors = {
                                        request_access: this.bot.requestAuthorizationForModerationActions(channel),
                                        command_not_supported: "I apologize, this command is still not supported :(",
                                        user_already_banned: "I'm sorry, this user is already banned :\\",
                                        invalid_game: "I'm sorry, I couldn't find that game on Twitch :(. Did you write it correctly?",
                                        unauthorized: "I apologize, I can't perform that action if you are using me as moderator. If you want me to perform this action you must set your env variable USE_BOT_ACCOUNT_FOR_MODERATION_ACTIONS as false and provide your streamer credentials."
                                    }

                                    this.bot.say(channel, errors[error.type]);

                                }

                            }

                        }

                        return {
                            tool_call_id: tools.id,
                            output: "null",
                        };

                    })
                );

                await openai.beta.threads.runs.submitToolOutputsStream(
                    event.data.thread_id,
                    event.data.id,
                    { tool_outputs: submit },
                );

            }

        }

        console.log("Running mod ended");

    },

}

module.exports = { GPTTrait };