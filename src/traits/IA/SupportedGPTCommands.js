module.exports = {
    
    SupportedGPTCommands: [

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
                        },
                        reason: {
                            type: "string",
                            description: "Razón por la cual determinaste que no debeía ejecutarse ninguna acción.",
                        },
                    },
                    required: ["user", "reason"],
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
        
        {
            type: "function",
            function: {
                name: "reminder",
                description: "Establece un recordatorio en la cantidad de tiempo que un usuario te lo pida",
                parameters: {
                    type: "object",
                    properties: {
                        username: {
                            type: "string",
                            description: "El nombre de usuario de la persona que te pidió el recordatorio.",
                        },
                        message: {
                            type: "string",
                            description: "El recordatorio que te pidió el usuario.",
                        },
                        time: {
                            type: "number",
                            description: "El tiempo convertido en milisegundos que te pidió el usuario",
                        }
                    },
                    required: ["username", "message", "time"],
                },
            },
        },

    ]
}