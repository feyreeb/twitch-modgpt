const { isEmpty } = require("#Helpers/helpers");

const { 
    USE_BOT_ACCOUNT_FOR_MODERATION_ACTIONS,
    BOT_HOSTED_URL,
    TWITCH_BOT_CLIENT_ID,
    TWITCH_BOT_CLIENT_SECRET,
    CHANNELS,
    DEFAULT_TIMEOUT_TIME,
    ENABLE_BOT_REWARDS_ANNOUNCEMENTS,
    GPT_MODEL,
    USING_RENDER,
} = process.env;

if ( isEmpty(TWITCH_BOT_CLIENT_ID) || isEmpty(TWITCH_BOT_CLIENT_SECRET) )
    throw new Error("You need to provide TWITCH_BOT_CLIENT_ID and TWITCH_BOT_CLIENT_SECRET env variables");

if ( isEmpty(BOT_HOSTED_URL) )
    throw new Error("You need to provide BOT_HOSTED_URL env variable");

if ( isEmpty(CHANNELS) )
    throw new Error("You need to provide at least one channel on CHANNELS env variable");

if ( isEmpty(USE_BOT_ACCOUNT_FOR_MODERATION_ACTIONS) )
    process.env.USE_BOT_ACCOUNT_FOR_MODERATION_ACTIONS = false;

if ( isEmpty(DEFAULT_TIMEOUT_TIME) )
    process.env.DEFAULT_TIMEOUT_TIME = 60;

if ( isEmpty(ENABLE_BOT_REWARDS_ANNOUNCEMENTS) )
    process.env.ENABLE_BOT_REWARDS_ANNOUNCEMENTS = false;

if ( isEmpty(GPT_MODEL) )
    process.env.GPT_MODEL = "gpt-3.5-turbo";

if ( isEmpty(USING_RENDER) )
    process.env.USING_RENDER = "false";

/* if ( !process.env.USE_BOT_ACCOUNT_FOR_MODERATION_ACTIONS )
    throw new Error("You need to provide TWITCH_STREAMER_CLIENT_ID and TWITCH_STREAMER_CLIENT_SECRET env variables if your bot will not have a moderator role in your channel"); */
