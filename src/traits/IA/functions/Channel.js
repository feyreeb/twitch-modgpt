module.exports = {

    Channel: [

        {
            type: "function",
            function: {
                name: "title",
                description: "Cambia el título del stream al título que <streamer> o <moderadores> o <trusted> te pida.",
                parameters: {
                    type: "object",
                    properties: {
                        title: {
                            type: "string",
                            description: "El título tal cual el <streamer> o <moderadores> o <trusted> te pidió",
                        },
                        message: {
                            type: "string",
                            description: "Un mensaje opcional que quieras mandar al chat de Twitch después de cambiar el título",
                        }
                    },
                    required: ["title"],
                },
            },
        },
        
        {
            type: "function",
            function: {
                name: "game",
                description: "Cambia la categoría del stream al nombre que <streamer> o <moderadores> o <trusted> te pida.",
                parameters: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "El título tal cual el <streamer> o <moderadores> o <trusted> te pidió",
                        },
                        message: {
                            type: "string",
                            description: "Un mensaje opcional que quieras mandar al chat de Twitch después de cambiar el título",
                        }
                    },
                    required: ["title"],
                },
            },
        },

    ]

}