const express = require("express");
const { job } = require("./render.js");
const { convertStringBoolean  } = require("#Helpers/helpers");

try {
    
    require("#Scripts/SetEnv");
    require("#Scripts/WakeUpBot");

    if(convertStringBoolean(process.env.USING_RENDER))
        job.start();

    //Initializations
    const app = express();

    app.set("port", process.env.PORT || 3000);
    app.set("host", process.env.HOST || "localhost");

    // Global middlewares
    app.use(express.json({
        limit: "10mb",
        extended: true
    }));

    app.use(express.urlencoded({
        limit: "10mb",
        extended: true,
        parameterLimit: 50000
    }));

    // Routes
    app.use(require("./routes"));

    //Starting Server
    app.listen(
        app.get("port"),
        app.get("host"),
        () => {
            console.log(`Server is running on http://${app.get("host")}:${app.get("port")}`);
        }
    );

} catch (error) {
    console.log(error);
}