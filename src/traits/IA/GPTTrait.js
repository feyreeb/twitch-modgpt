const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const openai = new OpenAI();

const GPTTrait = {

    async setAssistant(name) {
        let instructions = fs.readFileSync(path.resolve("context.txt")).toString();
        instructions = instructions.replace(/\{\{username\}\}/g, name);

        this.assistant = await openai.beta.assistants.create({
            name: name,
            instructions: instructions,
            tools: [
            {
                type: "function",
                function: {
                    name: "get_current_weather",
                    description: "Get the current weather in a given location",
                    parameters: {
                    type: "object",
                    properties: {
                        location: {
                        type: "string",
                        description: "The city and state, e.g. San Francisco, CA",
                        },
                        unit: { type: "string", enum: ["celsius", "fahrenheit"] },
                    },
                    required: ["location"],
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

    getChat(channel) {
        return this.threads[channel];
    },

    async addMessage(channel, username, message) {

        const chat = this.threads[channel];

        await openai.beta.threads.messages.create(
            chat.id,
            {
                role: "user",
                content: `${username} dijo: ${message}`
            }
        );

        const run = await openai.beta.threads.runs.create(chat.id, {
            assistant_id: this.assistant.id,
            stream: true
        });

        console.log("run");
        console.log(run);

        for await (const event of run)
            if (event.event === "thread.message.completed")
                return event.data.content.map(message => message.text.value);

        return "No data";

        //return messages.data.reverse();

    }

}

module.exports = { GPTTrait };