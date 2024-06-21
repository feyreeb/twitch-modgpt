module.exports = {

    General: [

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
                name: "reminder",
                description: "Establece un recordatorio en la cantidad de tiempo que un usuario te pida",
                parameters: {
                    type: "object",
                    properties: {
                        username: {
                            type: "string",
                            description: "El nombre de usuario de la persona que te pidió el recordatorio.",
                        },
                        reminder: {
                            type: "string",
                            description: "El recordatorio que te pidió el usuario, pero dicho de tú a él.",
                        },
                        time: {
                            type: "number",
                            description: "El tiempo convertido en milisegundos que te pidió el usuario",
                        },
                        message: {
                            type: "string",
                            description: "Un mensaje confirmando que estableciste el recordatorio dentro de la cantidad de tiempo que el usuario te pidió",
                        }
                    },
                    required: ["username", "reminder", "time", "message"],
                },
            },
        },

    ]

}