'use strict';

const Command = require('../../utils/Command.js');

class Help extends Command {
    constructor() {
        super({
            name: 'help',
            category: 'utils',
            description: 'Display all the commands of the bot',
            options: [{
                type: "STRING",
                name: "command",
                description: "Get the help of this command",
                required: false,
            }],
            example: ['help', 'help botinfo'],
        })
    }

    async run(ctx){

        if(ctx.args.getString("command")){
            const command = ctx.client.commands.findCommand(ctx.args.getString("command").toLowerCase());
            if (!command) return ctx.reply(`The command \`${ctx.args.getString("command")}\` doesn't exist.`);

            return ctx.reply({
                embeds: [{
                    title: "Help",
                    description: command.description,
                    fields: [
                        {
                            name: "Usage",
                            value: command.options.map((x) => `\`${x.required ? "(" : "<"}${x.name}:${x.type.toLowerCase()}${x.required ? ")" : ">"}\``).join("\n"),
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
                }]
            });
        }

        const category = [];

        ctx.client.commands.commands.each((command) => {
            if (!category.includes(command.category) && !command.disabled) {
                category.push(command.category);
            }
        });

        ctx.reply({
            embeds: [{
                title: "Help",
                thumbnail: {
                    url: ctx.client.user.displayAvatarURL({ size: 512, format: "png" })
                },
                description: `Here is the list of my commands.\nExample:\n\`/<command> Execute a command.\`\n\`/help <command> Help of a command.\`\n[Bot Structure](https://github.com/warix8/discord.js-bot-structure#readme)\n`,
                fields: category.map(x => {
                    return {
                        name: x,
                        value: ctx.client.commands.commands.filter(cmd => cmd.category === x && !cmd.cmdTest).map(cmd => `\`${cmd.name}\``).join(", ")
                    };
                }),
                timestamp: new Date(),
                footer: {
                    text: ctx.client.user.username,
                    iconURL: ctx.client.user.avatarURL()
                }
            }]
        })

    }

}

module.exports = new Help;