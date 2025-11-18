"use strict";

import Command from "../../utils/Command.js";
import { ApplicationCommandOptionType, ApplicationCommandType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import { BaseContext } from "../../utils/Context.js";

export default class Help extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: "help",
			category: "utils",
			description: "Display the help of the bot or a command.",
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "command",
					description: "Get the help of this command",
					required: false
				}
			],
			userPerms: [PermissionsBitField.Flags.BanMembers, PermissionsBitField.Flags.KickMembers],
			examples: ["help", "help botinfo"]
		});
	}

	async run(ctx: BaseContext<ChatInputCommandInteraction>) {
		if (ctx.args.getString("command")) {
			const command: Command | undefined = ctx.client.commands.findCommand(
				ctx.args?.getString("command")?.toLowerCase()
			);
			if (!command) return ctx.reply(`The command \`${ctx.args.getString("command")}\` doesn't exist.`);

			return ctx.reply({
				embeds: [
					{
						title: "Help",
						description: command.description,
						fields: [
							{
								name: "Options",
								value: " no " /*command.options.length > 0
                                ? command.options.map((x) => `\`${x?. ? "(" : "<"}${x.name}:${x.type.toString().toLowerCase()}${x?.required ? ")" : ">"}\``).join("\n")
                                : "No options",*/,
								inline: true
							},
							{
								name: "Examples",
								value:
									command.examples.length > 0
										? command.examples.map(x => "`" + x + "`").join("\n")
										: "No examples",
								inline: true
							}
						]
					}
				]
			});
		}

		const category: string[] = [];

		ctx.client.commands.commands.each((command: Command) => {
			if (!category.includes(command.category) && !command.disabled) {
				category.push(command.category);
			}
		});

		ctx.reply({
			embeds: [
				{
					title: "Help",
					thumbnail: {
						url: ctx.client.user.displayAvatarURL({ size: 512 })
					},
					description:
						"Here is the list of my commands.\nExample:\n`/<command> Execute a command.`\n`/help <command> Help of a command.`\n[Bot Structure](https://github.com/warix8/discord.js-bot-structure#readme)\n",
					fields: category.map(x => {
						return {
							name: x,
							value: ctx.client.commands.commands
								.filter((cmd: Command) => cmd.category === x && !cmd.testCmd)
								.map((cmd: Command) => `\`${cmd.name}\``)
								.join(", ")
						};
					}),
					timestamp: new Date().toISOString(),
					footer: {
						text: ctx.client.user.username,
						icon_url: ctx.client.user.avatarURL()
					}
				}
			]
		});
	}
}
