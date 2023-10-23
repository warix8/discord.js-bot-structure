"use strict";

// On récupère des classes ici
import { Client, IntentsBitField, Partials } from "discord.js";
import CommandsManager from "./src/managers/CommandsManager";
import EventsManager from "./src/managers/EventsManager.js";
import Logger from "./src/utils/base/Logger";
import * as config from "./config.json";
import { ConfigFile } from "./src/utils/Constants";
import "reflect-metadata";

// Création de notre classe Bot qui est la principale et qui est étendu de Client
class Bot extends Client {
	config: ConfigFile;
	logger: Logger;
	events: EventsManager;
	commands!: CommandsManager;

	constructor() {
		// On passe les options à la classe Client : https://discord.js.org/#/docs/main/stable/class/Client
		// Listes des options : https://discord.js.org/#/docs/main/stable/typedef/ClientOptions
		super({
			partials: [Partials.Channel],
			intents: [
				IntentsBitField.Flags.Guilds,
				IntentsBitField.Flags.GuildMessages,
				IntentsBitField.Flags.GuildMembers,
				IntentsBitField.Flags.GuildBans,
				IntentsBitField.Flags.GuildMessageReactions,
				IntentsBitField.Flags.GuildIntegrations,
				IntentsBitField.Flags.GuildWebhooks,
				IntentsBitField.Flags.GuildEmojisAndStickers,
				IntentsBitField.Flags.GuildVoiceStates,
				IntentsBitField.Flags.DirectMessages,
				IntentsBitField.Flags.DirectMessageReactions,
				IntentsBitField.Flags.DirectMessageTyping,
				IntentsBitField.Flags.GuildScheduledEvents,
				IntentsBitField.Flags.GuildPresences,
				IntentsBitField.Flags.GuildMessageTyping,
				IntentsBitField.Flags.GuildMessages
			]
		});
		this.config = config; // récupérer la config
		// on définit notre logger comme ca on a la date dans la console et des couleurs
		this.logger = new Logger(`Shard #${this.shard?.ids?.toString() ?? "0"}`);
		// regarder aux classes suivantes pour + d'infos
		this.events = new EventsManager(this);

		this.launch()
			.then(() => {
				this.commands = new CommandsManager(this);
				// On load nos commandes
				this.commands
					.loadCommands()
					.then(() => {
						this.logger.success(`[Commands] Loaded ${this.commands?.commands.size} commands`);
						this.logger.success("All was successfuly launched");
					})
					.catch(error => {
						this.logger.error(
							`[CommandLoadError] An error occured when loading commands ${error}`,
							error.stack
						);
					});
			})
			.catch(error => {
				this.logger.error(`[LaunchError] An error occured at startup ${error}`, error.stack);
			});
	}

	async launch() {
		// On load nos events
		await this.events.loadEvent();
		this.logger.success(`[Events] Loaded ${this.events.events.size} events`);

		try {
			await this.login(this.config.bot.token);
			this.logger.success("[WS] Connected to discord");
		} catch (error) {
			this.logger.error(`[WS] Connection error: ${error}`);
			return process.exit(1);
		}
	}
}

export default new Bot();
