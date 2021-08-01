"use strict";


import { Collection } from "discord.js";
// @ts-ignore
import humanizeDuration = require("humanize-duration");
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

        const [guilds, users] = await Promise.all<Collection<any, number>, Collection<any, number>>([
            // @ts-ignore
            ctx.shards.fetchClientValues("guilds.cache.size"),
            // @ts-ignore
            ctx.shards.fetchClientValues("users.cache.size")
        ]);

        ctx.reply({
            embeds: [{
                thumbnail: {
                    url: ctx.client.user.displayAvatarURL({ size: 512, dynamic: true })
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
                        value: "`" + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB` + "`",
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
                        value: "`" + humanizeDuration(ctx.client.uptime, { language: "fr" }) + "`"
                    }

                ]
            }]
        });

    }

}

module.exports = new Botinfo();
