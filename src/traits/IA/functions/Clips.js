module.exports = {

    Clips: [

        {
            type: "function",
            function: {
                name: "createClip",
                description: "Crea un clip de Twitch cada vez que alguien te lo pida.",
                parameters: {
                    type: "object",
                    properties: {
                        message: {
                            type: "string",
                            description: "Un mensaje diciendo que estás creando el clip y que estará listo en un momento porque puede tardar un rato en crearse.",
                        }
                    },
                    required: ["message"],
                },
            },
        },

    ]

}