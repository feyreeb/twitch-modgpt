module.exports = {

    Ban: [

        {
            type: "function",
            function: {
                name: "timeout",
                description: "Silencia a un usuario que tiene un mal comportamiento en el chat. Esta función también debe ser llamada si <streamer> o <moderadores> te lo piden.",
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
                    required: ["username"],
                },
            },
        },
        
        {
            type: "function",
            function: {
                name: "ban",
                description: "Banea a un usuario que tiene un mal comportamiento en el chat. Esta función también debe ser llamada si <streamer> o <moderadores> te lo piden.",
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
                    required: ["username"],
                },
            },
        },
        
        {
            type: "function",
            function: {
                name: "unban",
                description: "Quita el ban al usuario que <streamer> o <moderadores> te pida.",
                parameters: {
                    type: "object",
                    properties: {
                        username: {
                            type: "string",
                            description: "El nombre de usuario completo del usuario al que le vas a quitar el ban",
                        },
                        message: {
                            type: "string",
                            description: "Un mensaje opcional que quieras mandar al chat de Twitch después de quitar el ban al usuario",
                        }
                    },
                    required: ["username"],
                },
            },
        },
        
        {
            type: "function",
            function: {
                name: "untimeout",
                description: "Quita el timeout al usuario que <streamer> o <moderadores> te pida.",
                parameters: {
                    type: "object",
                    properties: {
                        username: {
                            type: "string",
                            description: "El nombre de usuario completo del usuario al que le vas a quitar el timeout",
                        },
                        message: {
                            type: "string",
                            description: "Un mensaje opcional que quieras mandar al chat de Twitch después de quitar el timeout al usuario",
                        }
                    },
                    required: ["username"],
                },
            },
        },

    ]

}