"use strict";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import logo from "asciiart-logo";
import Logger from "./src/utils/base/Logger";
import { bot, sharding } from "./config.json";
import * as botPackage from "./package.json";

const shardManagerLogger: Logger = new Logger("ShardingManager");

shardManagerLogger.info(logo(botPackage).render());
shardManagerLogger.info("Sharding manager starting !");

const startTime = Date.now();


import { join } from "path";
import { ClusterManager } from "discord-hybrid-sharding";

const manager = new ClusterManager(join(__dirname, "index.js"), {
	totalShards: sharding.totalShards,
	shardsPerClusters: sharding.shardsPerClusters,
	respawn: true,
	token: bot.token,
	mode: "process"
});

manager.on("clusterCreate", cluster => {
	console.info(`Creating Cluster #${cluster.id} with ${cluster.shardList.length} shards.`);
});

manager
	.spawn()
	.then(() => console.info(`The bot has started in ${((Date.now() - startTime) / 1000).toFixed(1)} seconds`));