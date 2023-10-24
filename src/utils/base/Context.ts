"use strict";

import {
	CommandInteraction,
	CommandInteractionOptionResolver,
	Guild,
	ShardClientUtil,
	User,
	GuildMember,
	InteractionReplyOptions,
	MessagePayload,
	InteractionDeferReplyOptions,
	WebhookFetchMessageOptions,
	TextBasedChannel
} from "discord.js";
import Client from "../../../main";
import { GuildModel } from "../../database/models/Guild";

/*
Ca va paraitre énervent au début mais c'est super utile ! Au lieu de faire à chaque fois dans vos commandes
Au lieu de message, ou client ca sera -> ctx.message ou ctx.client
Avantages:
Au lieu de faire message.guild.members.cache.get(message.author.id); dans vos commandes
ctx.member; utile non ?
remplacer aussi ctx.message.channel.send() par ctx.send(); !
*/
class Context {
	interaction: CommandInteraction;
	client: typeof Client;
	args: CommandInteractionOptionResolver;
	lang: string;
	guildSettings: GuildModel;

	constructor(client: typeof Client, interaction: CommandInteraction, guildSettings: GuildModel) {
		this.interaction = interaction;
		this.client = client;
		this.args = (
			interaction instanceof CommandInteraction ? interaction.options : null
		) as CommandInteractionOptionResolver;
		this.guildSettings = guildSettings;
		this.lang = guildSettings.lang ?? client.config.mainLang;
	}

	get shards(): ShardClientUtil {
		if (!this.client?.shard) throw new Error("Shard non trouvable");
		return this.client.shard;
	}

	get guild(): Guild {
		if (!this.interaction.guild) throw new Error("Not a guild");
		return this.interaction.guild;
	}

	get channel(): TextBasedChannel {
		if (this.interaction.channel.isTextBased()) throw new Error("Not a text channel");
		return this.interaction.channel;
	}

	get author(): User {
		return this.interaction.user;
	}

	get member(): GuildMember {
		return this.interaction.member instanceof GuildMember
			? this.interaction.member
			: this.guild.members.cache.get(this.interaction.member.user.id);
	}

	get me(): GuildMember {
		return this.guild.members.me;
	}

	reply(content: string | MessagePayload | InteractionReplyOptions) {
		return this.interaction.reply(content); // for embed or file or simple message
	}

	deferReply(options?: InteractionDeferReplyOptions) {
		this.interaction.deferReply(options);
	}

	followUp(content: string | MessagePayload | InteractionReplyOptions) {
		return this.interaction.followUp(content);
	}

	editReply(content: string | MessagePayload | WebhookFetchMessageOptions) {
		return this.interaction.editReply(content);
	}

	deleteReply(): Promise<void> {
		return this.interaction.deleteReply();
	}

	translate(text: TemplateStringsArray | string[], ...values: unknown[]) {
		return this.client.I18n.translate(text, ...values);
	}
}

export default Context;
