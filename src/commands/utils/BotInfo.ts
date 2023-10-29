"use strict";

import { Collection } from "discord.js";
import Command from "../../utils/base/Command";
import Context from "../../utils/base/Context";

class Botinfo extends Command {
	constructor() {
		super({
			name: "botinfo",
			category: "utils",
			description: "Displays the bot informations.",
			options: [],
			testCmd: true
		});
	}

	async run(ctx: Context) {
		const [guilds, users] = (await Promise.all([
			ctx.cluster.fetchClientValues("guilds.cache.size"),
			ctx.cluster.fetchClientValues("users.cache.size")
		])) as unknown as [Collection<unknown, number>, Collection<unknown, number>];

		const ram = (await ctx.client.cluster.broadcastEval(() => process.memoryUsage())) as unknown as Collection<
			unknown,
			NodeJS.MemoryUsage
		>;

		ctx.reply({
			embeds: [
				{
					thumbnail: {
						url: ctx.client.user.displayAvatarURL({ size: 512 })
					},
					title: ctx.translate`Bot info`,
					fields: [
						{
							name: ctx.translate`Servers`,
							value: "`" + guilds.reduce((acc, count) => acc + count, 0) + "`",
							// value: "`" + guilds.reduce((acc, guild) => acc + count, 0) + "`",
							inline: true
						},
						{
							name: ctx.translate`Users`,
							value: "`" + users.reduce((acc, count) => acc + count, 0) + "`",
							inline: true
						},
						{
							name: "Ram",
							value:
								"`" +
								`Heap: ${(
									ram.reduce((acc, memoryUsage) => acc + memoryUsage.heapUsed, 0) /
									1024 /
									1024
								).toFixed(1)}MB\nRSS: ${(
									ram.reduce((acc, memoryUsage) => acc + memoryUsage.rss, 0) /
									1024 /
									1024
								).toFixed(1)}MB` +
								"`",
							inline: true
						},
						{
							name: "Clusters",
							value: "`" + ctx.cluster.info.CLUSTER_COUNT + "`",
							inline: true
						},
						{
							name: "Shards",
							value: "`" + ctx.cluster.info.TOTAL_SHARDS + "`",
							inline: true
						},
						{
							name: ctx.translate`Bot structure`,
							value: "[Github Source](https://github.com/warix8/discord.js-bot-structure#readme)",
							inline: true
						},
						{
							name: ctx.translate`Uptime`,
							value: "`" + (ctx.client.uptime / 60000).toFixed(2) + "min`"
						}
					]
				}
			]
		});
	}
}

export default Botinfo;
