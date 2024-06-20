const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const openai = new OpenAI();

const GPTTrait = {

    async setAssistant() {

        const name = this.bot.botData.login;

        let instructions = fs.readFileSync(path.resolve("context.txt")).toString();
        instructions = instructions.replace(/\{\{username\}\}/g, name);

        this.assistant = await openai.beta.assistants.create({
            name: name,
            instructions: instructions,
            tools: [
                {
                    type: "function",
                    function: {
                        name: "nothing",
                        description: "Esta función debe ser llamada cuando un usuario se está portando bien y no requiere ninguna acción de moderación o cuando determines que no es necesario interactuar con el chat.",
                        parameters: {
                            type: "object",
                            properties: {
                                user: {
                                    type: "string",
                                    description: "El nombre de usuario completo del usuario que no requirió ninguna acción",
                                }
                            },
                            required: ["user"],
                        },
                    },
                },
                {
                    type: "function",
                    function: {
                        name: "say",
                        description: "Esta función debe ser llamada cuando determines que es necesario interactuar en el chat.",
                        parameters: {
                            type: "object",
                            properties: {
                                message: {
                                    type: "string",
                                    description: "El mensaje que vas a enviar al chat de Twitch.",
                                }
                            },
                            required: ["message"],
                        },
                    },
                },
                {
                    type: "function",
                    function: {
                        name: "timeout",
                        description: "Silencia a un usuario que tiene un mal comportamiento en el chat",
                        parameters: {
                            type: "object",
                            properties: {
                                username: {
                                    type: "string",
                                    description: "El nombre de usuario completo del usuario que vas a silenciar",
                                },
                                time: {
                                    type: "number",
                                    description: "El tiempo en segundos que decidiste silenciar a dicho usuario",
                                },
                                reason: {
                                    type: "string",
                                    description: "La razón por la cual decidiste silenciar al usuario",
                                },
                                message: {
                                    type: "string",
                                    description: "Un mensaje amigable que quieras mandar al chat de Twitch después de silenciar al usuario",
                                }
                            },
                            required: ["user"],
                        },
                    },
                },
                {
                    type: "function",
                    function: {
                        name: "ban",
                        description: "Banea a un usuario que tiene un mal comportamiento en el chat",
                        parameters: {
                            type: "object",
                            properties: {
                                username: {
                                    type: "string",
                                    description: "El nombre de usuario completo del usuario que vas a banear",
                                },
                                reason: {
                                    type: "string",
                                    description: "La razón por la cual decidiste banear al usuario",
                                },
                                message: {
                                    type: "string",
                                    description: "Un mensaje opcional que quieras mandar al chat de Twitch después de banear al usuario",
                                }
                            },
                            required: ["user"],
                        },
                    },
                },
            ],
            model: process.env.GPT_MODEL
        });

    },

    async setThread(channels) {

        for (const channel of channels)
            this.threads[channel.toLowerCase()] = await openai.beta.threads.create();

    },

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

    async getGPTResponse(channel) {

        const chat = this.threads[channel];

        const run = await openai.beta.threads.runs.create(chat.id, {
            assistant_id: this.assistant.id,
            stream: true
        });

        console.log("Running mod");
        for await (const event of run) {

            if (event.event === "thread.run.requires_action") {

                const submit = event.data.required_action.submit_tool_outputs.tool_calls.map(tools => {

                    const commandName = tools.function.name;
                    const commandArgs = JSON.parse(tools.function.arguments);

                    if(commandName !== "nothing") {

                        if (commandName !== "say")
                            this.bot.performModerationActions(channel, commandName, commandArgs);

                        if (commandArgs.message)
                            this.bot.say(channel, commandArgs.message);

                    }


                    /* switch (tools.function.name) {

                        

                        case "say":
                            console.log("Saying");
                            console.log((JSON.parse(tools.function.arguments)).message);
                            this.bot.say("#"+channel, (JSON.parse(tools.function.arguments)).message);
                            return {
                                tool_call_id: tools.id,
                                output: (JSON.parse(tools.function.arguments)).message
                            };
                            break;

                        case "timeout":
                            this.bot.say("#"+channel, (JSON.parse(tools.function.arguments)).message);
                            return {
                                tool_call_id: tools.id,
                                output: (JSON.parse(tools.function.arguments)).message
                            };
                            break;

                        case "ban":
                            this.bot.say("#"+channel, (JSON.parse(tools.function.arguments)).message);
                            return {
                                tool_call_id: tools.id,
                                output: (JSON.parse(tools.function.arguments)).message
                            };
                            break;

                        case "nothing":
                            this.bot.say("#"+channel, "No diré nada");
                            return {
                                tool_call_id: tools.id,
                                output: "No diré nada"
                            };
                            break;
                    } */

                    return {
                        tool_call_id: tools.id,
                        output: "null",
                    };

                });

                await openai.beta.threads.runs.submitToolOutputsStream(
                    event.data.thread_id,
                    event.data.id,
                    { tool_outputs: submit },
                );

            }

        }

    },

}

module.exports = { GPTTrait };