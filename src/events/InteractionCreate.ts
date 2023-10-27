"use strict";

import type { Interaction } from "discord.js";
import Bot from "../../main";
import CommandService from "../services/CommandService";
import DiscordEvent from "../utils/base/DiscordEvent";

/*
L'évent interactionCreate n'est pas long car en faites les tâches sont répartis dans le dossier services prenez exemple sur CommandService ;)
*/

class InteractionCreate extends DiscordEvent {
	commands: CommandService;
	constructor(client: Bot) {
		super(client, "interactionCreate");
		this.client = client;
		this.commands = new CommandService(this.client);
	}

	async run(interaction: Interaction) {
		if (interaction.isChatInputCommand()) await this.commands.handle(interaction);
	}
}

module.exports = InteractionCreate;
