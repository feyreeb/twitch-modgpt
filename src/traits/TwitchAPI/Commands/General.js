module.exports = {

    General: {

        reminder(channel, { username, reminder, time, bot }) {
            setTimeout(() => {
                bot.say(channel, `@${username} recuerda: ${reminder}`)
            }, time)
        }

    }

};