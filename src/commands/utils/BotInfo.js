'use strict';

const humanizeDuration = require("humanize-duration");
const Command = require('../../utils/Command.js');

class Botinfo extends Command {
    constructor() {
        super({
            name: 'botinfo',
            category: 'utils',
            description: 'Displays the bot informations.',
            options: [],
            testCmd: true
        })
    }

    async run(ctx){

        const [guilds, users] = await Promise.all([
            ctx.shards.fetchClientValues("guilds.cache.size"),
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
                        value: "`" + ctx.shard.count + "`",
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
        })

    }

}

module.exports = new Botinfo;
