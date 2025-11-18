"use strict";

import { ApplicationCommandOptionData, ApplicationCommandType, ApplicationIntegrationType, BaseApplicationCommandData, ChatInputApplicationCommandData, CommandInteraction, InteractionContextType, MessageApplicationCommandData, PermissionResolvable, PermissionsBitField, UserApplicationCommandData } from "discord.js";
import { BaseContext, CachedGuildContext } from "./Context";

/*
La classe commandes très utiles surtout utilisez les paramètres ci-dessous pour vous simplifier la vie
Au lieu de mettre member.hasPermissions à plein d'endroit le bot executera des test en fonction des options de votre commandes !
*/

interface CommandInfo {
	type: ApplicationCommandType;
	name: string;
	description: string;
	category: string;
	options?: ApplicationCommandOptionData[];
	examples?: string[];
	userPerms?: bigint[];
	botPerms?: bigint[];
	disabled?: boolean;
	ownerOnly?: boolean;
	guildOnly?: boolean;
	testCmd?: boolean;
	nsfw?: boolean;
	descriptionLocalizations?: Record<string, string>;
	nameLocalizations?: Record<string, string>;
	integrationTypes?: ApplicationIntegrationType[];
	contexts?: InteractionContextType[];
}

export default abstract class Command {
	type: ApplicationCommandType;
	name: string;
	description: string;
	category: string;
	options: ApplicationCommandOptionData[];
	examples: string[];
	userPerms: PermissionResolvable;
	botPerms: bigint[];
	disabled: boolean;
	ownerOnly: boolean;
	guildOnly: boolean;
	testCmd: boolean;
	nsfw: boolean;
	descriptionLocalizations: Record<string, string>;
	nameLocalizations: Record<string, string>;
	integrationTypes: ApplicationIntegrationType[];
	contexts: InteractionContextType[];
	constructor(info: CommandInfo) {
		this.type = info.type || ApplicationCommandType.ChatInput;
		this.name = info.name;
		this.category = info.category;
		this.description = info.description;
		this.options = info.options || [];
		this.examples = info.examples || [];
		this.descriptionLocalizations = info.descriptionLocalizations || {};
		this.nameLocalizations = info.nameLocalizations || {};

		this.userPerms = (info.userPerms?.length && info.userPerms.length > 0)? new PermissionsBitField(info.userPerms) : undefined;
		this.botPerms = info.botPerms || [];
		this.disabled = info.disabled || false;
		this.ownerOnly = info.ownerOnly || false;
		this.guildOnly = info.guildOnly || false;
		this.testCmd = info.testCmd || false;
		this.nsfw = info.nsfw || false;
		// this.cooldown = info.cooldown || 0; Si vous voulez faire votre système de cooldown ;)

		this.integrationTypes = info.integrationTypes || [ApplicationIntegrationType.GuildInstall];
		this.contexts = info.contexts || [InteractionContextType.Guild];
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(ctx: BaseContext<CommandInteraction> | CachedGuildContext<CommandInteraction<"cached">>): Promise<unknown | void>;

	get commandData(): ChatInputApplicationCommandData | MessageApplicationCommandData | UserApplicationCommandData {
		const base: BaseApplicationCommandData = {
			name: this.name,
			contexts: this.contexts,
			integrationTypes: this.integrationTypes,
			nameLocalizations: this.nameLocalizations,
			nsfw: this.nsfw
		};
		if (this.userPerms) {
			Object.assign(base, {
				defaultMemberPermissions: this.userPerms,
			});
		}
		if (this.type === ApplicationCommandType.ChatInput) {
			return {
				...base,
				type: ApplicationCommandType.ChatInput,
				description: this.description,
				options: this.options,

			};
		} else if (this.type === ApplicationCommandType.Message) {
			return {
				...base,
				type: ApplicationCommandType.Message,
			};
		} else {
			return {
				...base,
				type: ApplicationCommandType.User,
			};
		}
	}
}
