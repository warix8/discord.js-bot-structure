"use strict";

// On récupère des classes ici
import { Client, Intents, Options, LimitedCollection, VoiceChannel } from "discord.js";
import CommandsManager from "./src/utils/CommandsManager";
import EventsManager from "./src/utils/EventsManager.js";
import Logger from "./src/utils/Logger";
import * as config from "./config.json";

// Création de notre classe Bot qui est la principale et qui est étendu de Client
class Bot extends Client {
    config: any;
    logger: Logger;
    events: EventsManager;
    commands!: CommandsManager;

    constructor() {
        // On passe les options à la classe Client : https://discord.js.org/#/docs/main/stable/class/Client
        // Listes des options : https://discord.js.org/#/docs/main/stable/typedef/ClientOptions
        super({
            /*messageCacheLifetime: 300,
            messageSweepInterval: 60,*/
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES],
            makeCache: Options.cacheWithLimits({
                MessageManager: {
                    sweepInterval: 300,
                    sweepFilter: LimitedCollection.filterByLifetime({
                        lifetime: 900,
                        getComparisonTimestamp: e => e?.editedTimestamp ?? e?.createdTimestamp,
                    })
                },
                /*UserManager: {
                    sweepInterval: 300,
                    sweepFilter: LimitedCollection.filterByLifetime({
                        lifetime: 1800,
                        getComparisonTimestamp: e => e?.createdTimestamp,
                    })
                },*/
                ChannelManager: {
                    sweepInterval: 3600,
                    sweepFilter: LimitedCollection.filterByLifetime({
                        lifetime: 900,
                        getComparisonTimestamp: e => e.isText() ? e.lastMessage?.createdTimestamp ?? 0 : e instanceof VoiceChannel && e.members.size === 0 ? 0 : Date.now()
                    }),
                },
                ThreadManager: {
                    sweepInterval: 3600,
                    sweepFilter: LimitedCollection.filterByLifetime({
                        getComparisonTimestamp: e => e.archiveTimestamp,
                        excludeFromSweep: e => !e.archived,
                    }),
                }
            }),
        });
        this.config = config;// récupérer la config
        // on définit notre logger comme ca on a la date dans la console et des couleurs
        this.logger = new Logger(`Shard #${this.shard?.ids?.toString() ?? "0"}`);
        // regarder aux classes suivantes pour + d'infos
        this.events = new EventsManager(this);

        this.launch().then(() => {

            this.commands = new CommandsManager(this);
            // On load nos commandes
            this.commands.loadCommands().then(() => {
                this.logger.success(`[Commands] Loaded ${this.commands?.commands.size} commands`);
                this.logger.success("All was successfuly launched");
            }).catch((error) => {
                this.logger.error(`[CommandLoadError] An error occured when loading commands ${error}`, error.stack);
            });

        }).catch(error => {
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