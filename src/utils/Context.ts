"use strict";

import {
	CommandInteraction,
	ShardClientUtil,
	User,
	InteractionReplyOptions,
	MessagePayload,
	InteractionDeferReplyOptions,
	WebhookFetchMessageOptions,
	ChatInputCommandInteraction,
	MessageComponentInteraction} from "discord.js";
import Bot from "../../main";
import { Guild, Prisma } from "@prisma/client";
import prisma from "./PrismaClient";


export class BaseContext<Interaction extends MessageComponentInteraction | CommandInteraction = CommandInteraction> {
	interaction: Interaction;
	client: Bot;
	lang: string;

	constructor(client: Bot, interaction: Interaction) {
		this.interaction = interaction;
		this.client = client;
		this.lang = interaction.locale;
	}
	get shards(): ShardClientUtil {
		if (!this.client?.shard) throw new Error("Shard non trouvable");
		return this.client.shard;
	}

	get author(): User {
		return this.interaction.user;
	}

	get args(): Interaction extends ChatInputCommandInteraction
		? Interaction["options"]
		: null {
		return (this.interaction.isChatInputCommand() ? this.interaction.options : null) as Interaction extends ChatInputCommandInteraction
			? Interaction["options"]
			: null;
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

	translate(key: string) {
		return key; // To implement
	}
}

// Put your database stuff here like guild settings
export class CachedGuildContext<Interaction extends CommandInteraction<"cached">> extends BaseContext<Interaction> {
	guildSettings: Guild;
	constructor(client: Bot, interaction: Interaction, guildSettings: Guild) {
		super(client, interaction);
		this.guildSettings = guildSettings;
	}

	get guild() {
		return this.interaction.guild;
	}

	get me() {
		return this.interaction.guild.members.me;
	}

	get member() {
		return this.interaction.member;
	}

	get channel() {
		return this.interaction.channel;
	}

	async updateGuildSettings(data: Prisma.GuildUpdateInput) {
		this.guildSettings = await prisma.guild.update({
			where: { id: this.guild.id },
			data
		});
	}
}
