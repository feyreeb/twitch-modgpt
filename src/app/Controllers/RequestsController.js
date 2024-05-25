const { Controller } = require("./Controller");
const { OAuth } = require("#Classes/TwitchOAuth");

class RequestsController extends Controller {

    async index(req, res) {

        console.log("Hola");
        res.send("Hola");

    }

    authBot(_, res) {
        return res.redirect(OAuth.getBotAuthorizationURL());
    }

    authStreamer(_, res) {
        return res.redirect(OAuth.getStreamerAuthorizationURL());
    }

    async getBotToken(req, res) {

        const { code, error} = req.query;

        if (error)
            return res.send("You must authorize the app so the bot can send messages using this account.");

        const saved = await OAuth.getAndSaveToken("bot", code);

        return saved ? res.send("That's all! Now your bot is working") : res.send("There was an error getting your token");

    }

    async getStreamerToken(req, res) {

        const { code, error} = req.query;

        if (error)
            return res.send("You must authorize the app so the bot can perform moderation actions.");

        const saved = await OAuth.getAndSaveToken("streamer", code);

        return saved ? res.send("That's all! Now your bot can perform moderation actions") : res.send("There was an error getting your token");

    }

}

module.exports = RequestsController;