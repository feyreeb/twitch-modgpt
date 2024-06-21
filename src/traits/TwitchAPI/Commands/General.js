module.exports = {

    General: {

        /**
         * Set a reminder in a given time
         * @param {String} channel The channel where the reminder will be set
         * @param {Object} args The arguments for this function
         * @param {Object} args.username The user that asked for the reminder
         * @param {Object} args.reminder The reminder
         * @param {Object} args.time The time in ms when the reminder will be triggered
         */
        reminder(channel, { username, reminder, time }) {
            setTimeout(() => {
                this.bot.say(channel, `@${username} recuerda: ${reminder}`)
            }, time)
        }

    }

};