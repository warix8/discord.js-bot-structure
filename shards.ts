"use strict";

import { ShardingManager } from "discord.js";
// @ts-ignore
import logo = require("asciiart-logo");
import Logger from "./src/utils/Logger";
import { bot } from "./config.json";
import * as botPackage from "./package.json";

const shardManagerLogger: Logger = new Logger("ShardingManager");

console.debug(botPackage.version);

shardManagerLogger.info(logo(botPackage).render());
shardManagerLogger.info("Sharding manager starting !");

const processArgs = process.argv.slice(2);

new ShardingManager("./dist/main.js", {
    respawn : true,
    totalShards: processArgs && parseInt(processArgs[1]) && processArgs[0] === "--shard" ? parseInt(processArgs[1]) : "auto",
    token : bot.token
}).on("shardCreate", (shard) => {
    shardManagerLogger.info(`Creating Shard #${shard.id}`);
}).spawn().then(() => {
    shardManagerLogger.sucess("All shards are launched !");
}).catch(err => {
    shardManagerLogger.error("An error has occurred ! " + err);
    return process.exit(1);
});
