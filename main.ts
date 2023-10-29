"use strict";

// On récupère des classes ici
import { Client, IntentsBitField, Options, Partials } from "discord.js";
import CommandsManager from "./src/managers/CommandsManager";
import EventsManager from "./src/managers/EventsManager.js";
import Logger from "./src/utils/base/Logger";
import * as config from "./config.json";
import I18n from "./src/i18n";
import { ConfigFile } from "./src/utils/Constants";
import "reflect-metadata";
import DatabaseManager from "./src/managers/DatabaseManager";
import { ClusterClient, getInfo } from "discord-hybrid-sharding";

// Création de notre classe Bot qui est la principale et qui est étendu de Client
class Bot extends Client {
	config: ConfigFile;
	logger: Logger;
	events: EventsManager;
	commands!: CommandsManager;
	database: DatabaseManager;
	I18n: I18n;
	cluster: ClusterClient<this>;
	
	constructor() {
		// On passe les options à la classe Client : https://discord.js.org/#/docs/main/stable/class/Client
		// Listes des options : https://discord.js.org/#/docs/main/stable/typedef/ClientOptions
		super({
			partials: [Partials.Channel],
			intents: [
				IntentsBitField.Flags.Guilds,
				IntentsBitField.Flags.GuildMessages,
				IntentsBitField.Flags.GuildMembers,
				IntentsBitField.Flags.GuildModeration,
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
			],
			makeCache: Options.cacheWithLimits({
				...Options.DefaultMakeCacheSettings,
				ReactionManager: 0,
				GuildMemberManager: {
					maxSize: 200,
					keepOverLimit: member => member.id === this.user.id,
				}
			}),
			sweepers: {
				messages: {
					interval: 3600, // Every hour...
					lifetime: 1800,	// Remove messages older than 30 minutes.
				},
				users: {
					interval: 3600, // Every hour...
					filter: () => user => user.bot && user.id !== this.user.id, // Remove all bots.
				}
			},
			shards: getInfo().SHARD_LIST, // An array of shards that will get spawned
			shardCount: getInfo().TOTAL_SHARDS, // Total number of shards
		});
		this.config = config; // récupérer la config
		// on définit notre logger comme ca on a la date dans la console et des couleurs
		this.cluster = new ClusterClient(this);
		this.logger = new Logger(`Cluster #${this.cluster.id}`);
		// regarder aux classes suivantes pour + d'infos
		this.events = new EventsManager(this);
		this.database = new DatabaseManager(this);
		this.I18n = new I18n();

		this.launch()
			.then(() => {
				// On load nos commandes
				this.commands = new CommandsManager(this);
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
			await this.database.loadDatabase();
			this.logger.success("[Database] Successfully connected to database");
		} catch (error) {
			this.logger.error(`[Database] Connection error: ${error}`);
			return process.exit(1);
		}

		await this.I18n.loader();
		this.logger.success(`[Langs] Loaded ${this.I18n.availableLangs.length} languages`);

		try {
			await this.login(this.config.bot.token);
			this.logger.success("[WS] Connected to discord");
		} catch (error) {
			this.logger.error(`[WS] Connection error: ${error}`);
			return process.exit(1);
		}
	}
}

export default Bot;
