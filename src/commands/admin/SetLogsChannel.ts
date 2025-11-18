"use strict";

import { ApplicationCommandOptionType, ApplicationCommandType, ChannelType, ChatInputCommandInteraction, PermissionsBitField } from "discord.js";
import Command from "../../utils/Command";
import { CachedGuildContext } from "../../utils/Context";

export default class SetLogsChannel extends Command {
	constructor() {
		super({
			type: ApplicationCommandType.ChatInput,
			name: "setlogschannel",
			category: "admin",
			description: "Set the logs channel.",
			options: [{
				type: ApplicationCommandOptionType.Channel,
				name: "channel",
				description: "Logs channel",
				required: true,
				channelTypes: [ChannelType.GuildText]
			}],
			userPerms: [PermissionsBitField.Flags.ManageGuild],
		});
	}

	async run(ctx: CachedGuildContext<ChatInputCommandInteraction<"cached">>) {

		const channel = ctx.args.getChannel("channel", true, [ChannelType.GuildText]);

		await ctx.updateGuildSettings({
			logs_channel: channel.id
		});

		await ctx.reply(`Logs channel set to ${channel}`);

	}
}
