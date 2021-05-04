'use strict';

const Command = require('../../utils/Command.js');

class Help extends Command {
    constructor() {
        super({
            name: 'help',
            category: 'utils',
            description: 'This command is used to config the bye system of this server',
            usage: ['help (command)'],
            example: ['help', 'help botinfo'],
            aliases: ['h']
        })
    }

    async run(ctx){

        if(ctx.args[0]){
            const command = ctx.client.commands.findCommand(ctx.args[0].toLowerCase());
            if (!command) return ctx.send(`The command ${ctx.args[0]} doesn't exist.`);

            return ctx.send({
                embed: {
                    color: "#fff",
                    title: "Help",
                    description: command.description,
                    fields: [
                        {
                            name: "Usage",
                            value: command.usage.map((x) => "`" + x + "`").join("\n"),
                            inline: true
                        },
                        {
                            name: "Examples",
                            value: command.examples ? command.examples.map((x) => "`" + x + "`").join("\n") : "No examples",
                            inline: true
                        },{
                            name: "Aliases",
                            value: command.aliases ? command.aliases.map((x) => "`" + x + "`").join("\n") : "No aliases",
                            inline: true
                        }
                    ]
                }
            });
        }

        const category = [];

        for (const command of ctx.client.commands.commands.array()) {
            if (!category.includes(command.category) && !command.disabled) {
                category.push(command.category);
            }
        }

        ctx.send({
            embed: {
                title: "Help",
                thumbnail: {
                    url: ctx.client.user.displayAvatarURL({ size: 512, format: "png" })
                },
                description: `Here is the list of my commands.\nExample:\n\`${ctx.prefix}<command> Execute a command.\`\n\`${ctx.prefix}help <command> Help of a command.\`\n[Bot Structure](https://github.com/warix8/discord.js-bot-structure#readme)\n`,
                fields: category.map(x => {
                    return {
                        name: x,
                        value: ctx.client.commands.commands.filter(cmd => cmd.category === x && !cmd.disabled).map(cmd => `\`${cmd.name}\``).join(", ")
                    };
                }),
                timestamp: new Date(),
                footer: {
                    text: ctx.client.user.username,
                    iconURL: ctx.client.user.avatarURL()
                }
            }
        })

    }

}

module.exports = new Help;