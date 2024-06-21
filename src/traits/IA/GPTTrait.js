const fs = require("fs");
const path = require("path");
const async = require('async');
const OpenAI = require("openai");
const openai = new OpenAI();

const { SupportedGPTCommands } = require("#Traits/IA/SupportedGPTCommands");
const { hasValue } = require("#Helpers/helpers");

const GPTTrait = {

    async processMessage(channel, username, message) {
        
        this.chats[channel.toLowerCase()]
            .push(`${username} dijo: ${message}`, error => {
                if (error)
                    console.error('Error en el procesamiento del mensaje:', error);
                else
                    console.log('Mensaje procesado con éxito');
            });

    },

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

    async createChats(channels) {

        for (const channel of channels)
            this.chats[channel.toLowerCase()] = await this.createQueue(channel)

    },

    async createQueue(channel) {

        const thread = await openai.beta.threads.create();

        // This queue unqueue one by one message that was enqueued each time a Twitch message is received
        return async.queue(async message => {
            try {
                await this.addMessage(thread, message);
                await this.getGPTResponse(thread, channel);
            } catch (error) {
                console.error('Error procesando el mensaje:', error.response ? error.response.data : error.message);
            }
        }, 1); // Just one message at a time


    },

    /**
     * Add a message to the corresponding thread
     * @param {String} thread The Open AI Thread where the message will be created
     * @param {String} message The message to add
     * @returns {openai.beta.thread.messages} An Open AI message object
     */
    async addMessage(thread, message) {

        console.log("Adding message to thread");
        return await openai.beta.threads.messages.create(
            thread.id,
            {
                role: "user",
                content: message
            }
        );

    },

    /**
     * Analyzes the messages, determine an action and executes it
     * @param {String} thread The Open AI Thread that will be run
     * @param {String} channel The channel of this thread
     */
    async getGPTResponse(thread, channel) {

        const run = await openai.beta.threads.runs.create(thread.id, {
            assistant_id: this.assistant.id,
            stream: true
        });

        console.log("Running mod");

        return await this.processRun(run, channel);

    },

    /**
     * Process a run until it resolves all actions and finishes
     * @param {openai.beta.threads.runs} run The run to process
     * @param {String} channel The channel that is running the thread
     * @returns {Promise<void>} When the run finishes successfully
     */
    processRun(run, channel) {

        return new Promise(async (resolve, reject) => {

            for await (const event of run) {
    
                if (event.event === "thread.run.requires_action") {
    
                    const submit = await Promise.all(
                        event.data.required_action.submit_tool_outputs.tool_calls.map(async tools => {
    
                            console.log(tools);
    
                            const commandName = tools.function.name;
                            const commandArgs = JSON.parse(tools.function.arguments);
    
                            if(commandName !== "nothing") {
    
                                try {

                                    if (commandArgs.message)
                                        this.bot.say(channel, commandArgs.message);
                                    
                                    if (commandName !== "say")
                                        await this.bot.performModerationActions(channel, commandName, commandArgs);
    
                                } catch (error) {
                                    
                                    if ( hasValue(error.type) ) {
    
                                        const errors = {
                                            request_access: this.bot.requestAuthorizationForModerationActions(channel),
                                            command_not_supported: "Lo siento, ese comando todavía no está soportado :(",
                                            user_already_banned: "Lo siento, ese usuario ya está baneado :\\",
                                            invalid_game: "Lo siento, no encontré esa categoría en Twitch :( ¿Te aseguraste de escribirla bien?",
                                            unauthorized: "Lo siento, no puedo hacer eso si me estás usando como moderador. Si quieres que sea capaz de hacer esa acción debes establecer la variable de entorno USE_BOT_ACCOUNT_FOR_MODERATION_ACTIONS como 'false' y debes proveer tus credenciales de streamer."
                                        }
    
                                        this.bot.say(channel, errors[error.type]);
    
                                    }
    
                                    reject(error);
    
                                }
    
                            }
    
                            return {
                                tool_call_id: tools.id,
                                output: "null",
                            };
    
                        })
                    );
    
                    const newRun = await openai.beta.threads.runs.submitToolOutputsStream(
                        event.data.thread_id,
                        event.data.id,
                        { tool_outputs: submit },
                    );
                    
                    try {
                        await this.processRun(newRun, channel);
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
    
                }
                else if (event.event === "thread.run.step.failed") {
                    console.log(event);
                }
                else if (event.event === "thread.run.failed") {
                    console.log(event);
                    reject(event);
                }
                else if (event.event === "thread.run.completed") {
                    console.log("Running mod ended");
                    resolve();
                }
    
            }

        });

    }

}

module.exports = { GPTTrait };