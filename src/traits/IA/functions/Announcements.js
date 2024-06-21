module.exports = {

    Announcements: [

        {
            type: "function",
            function: {
                name: "announce",
                description: "Manda un anuncio al chat cuando <streamer> o <moderadores> o <trusted> te lo pida explícitamente.",
                parameters: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "El anuncio que <streamer> o <moderadores> o <trusted> te pidió que hicieras",
                        },
                        color: {
                            type: "string",
                            description: "Elige una opción de la siguiente lista: primary, blue, green, orange, purple",
                        }
                    },
                    required: ["message"],
                },
            },
        },

    ]

}