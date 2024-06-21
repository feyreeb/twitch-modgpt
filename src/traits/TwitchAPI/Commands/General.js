module.exports = {

    General: {

        reminder(channel, { username, message, time, bot }) {
            setTimeout(() => {
                bot.say(channel, `@${username} recuerda: ${message}`)
            }, time)
        }

    }

};