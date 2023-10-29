"use strict";

import { inspect } from "util";
import Command from "../../utils/base/Command";
import { ApplicationCommandOptionType, Colors } from "discord.js";
import Context from "../../utils/base/Context";

class Eval extends Command {
	constructor() {
		super({
			name: "eval",
			category: "owner",
			description: "Eval a code.",
			testCmd: true,
			ownerOnly: true,
			options: [
				{
					type: ApplicationCommandOptionType.String,
					name: "code",
					required: true,
					description: "Code to execute."
				}
			]
		});
	}

	async run(ctx: Context) {
		const code = ctx.args.getString("code");

		if (!code) return ctx.reply("You must specify a JavaScript code");

		try {
			// tslint:disable-next-line: no-eval
			const ev = await eval(code);
			const str = inspect(ev, false, null);

			await ctx.reply({
				embeds: [
					{
						color: Colors.Blurple,
						author: {
							name: ctx.author.tag,
							icon_url: ctx.author.displayAvatarURL()
						},
						fields: [
							{
								name: "INPUT",
								value: "```JS\n" + code + "\n```"
							},
							{
								name: "OUTPUT",
								value: "```JS\n" + str.slice(0, 1000) + "\n```"
							}
						],
						footer: {
							text: ctx.client.user.tag,
							icon_url: ctx.client.user.avatarURL()
						}
					}
				]
			});
		} catch (error) {
			ctx.reply({
				embeds: [
					{
						// eslint-disable-next-line no-undef
						color: Colors.Red,
						author: {
							name: ctx.author.tag,
							icon_url: ctx.author.displayAvatarURL()
						},
						fields: [
							{
								name: "INPUT",
								value: "```JS\n" + code + "\n```"
							},
							{
								name: "ERROR",
								value: "```JS\n" + error + "\n```"
							}
						],
						footer: {
							text: ctx.client.user.tag,
							icon_url: ctx.client.user.avatarURL()
						}
					}
				]
			});
		}
	}
}

export default Eval;
