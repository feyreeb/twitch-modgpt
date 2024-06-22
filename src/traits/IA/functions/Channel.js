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
                            description: "Un mensaje diciendo que estás cambiando el título",
                        }
                    },
                    required: ["title", "message"],
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
                            description: "Un mensaje diciendo que estás cambiando la categoría",
                        }
                    },
                    required: ["title", "message"],
                },
            },
        },
        
        {
            type: "function",
            function: {
                name: "shoutout",
                description: "Promociona a los usuarios que <streamer> o <moderadores> o <trusted> te pida.",
                parameters: {
                    type: "object",
                    properties: {
                        to: {
                            type: "string",
                            description: "El nombre de usuario que te pidieron que promociones",
                        }
                    },
                    required: ["to"],
                },
            },
        },

    ]

}