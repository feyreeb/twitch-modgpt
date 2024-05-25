const router = require('./router');

router.get("/", "RequestsController@index");

router.get("/auth-bot", "RequestsController@authBot");

router.get("/auth-streamer", "RequestsController@authStreamer");

router.get("/get-bot-token", "RequestsController@getBotToken");

router.get("/get-streamer-token", "RequestsController@getStreamerToken");

module.exports = router;