"use strict";


import { Collection } from "discord.js";
import Command from "../../utils/Command";
import Context from "../../utils/Context";

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

    async run(ctx: Context){

        // @ts-ignore
        const [guilds, users]: [Collection<any, number>, Collection<any, number>]  = await Promise.all([
            ctx.shards.fetchClientValues("guilds.cache.size"),
            ctx.shards.fetchClientValues("users.cache.size")
        ]);

        const ram = await ctx.client.shard.broadcastEval(() => (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(1));

        ctx.reply({
            embeds: [{
                thumbnail: {
                    url: ctx.client.user.displayAvatarURL({ size: 512 })
                },
                title: "Bot info",
                fields: [
                    {
                        name: "Serveurs",
                        value: "`" + guilds.reduce((acc, count) => acc + count, 0) + "`",
                        // value: "`" + guilds.reduce((acc, guild) => acc + count, 0) + "`",
                        inline: true
                    },
                    {
                        name: "Utilisateurs",
                        value: "`" + users.reduce((acc, count) => acc + count, 0) + "`",
                        inline: true
                    },
                    {
                        name: "Ram",
                        // @ts-ignore
                        value: "`" + `Heap: ${ram.reduce((acc, memoryUsage) => acc + memoryUsage.heapUsed, 0)}\nRSS: ${ram.reduce((acc, memoryUsage) => acc + memoryUsage.rss, 0)}MB` + "`",
                        inline: true
                    },
                    {
                        name: "Shards",
                        value: "`" + ctx.shards.count + "`",
                        inline: true
                    },
                    {
                        name: "Bot Structure",
                        value: "[Github Source](https://github.com/warix8/discord.js-bot-structure#readme)",
                        inline: true
                    },
                    {
                        name: "Durée de fonctionnement",
                        value: "`" + (ctx.client.uptime/60000).toFixed(2) + "min`"
                    }

                ]
            }]
        });

    }

}

module.exports = new Botinfo();
