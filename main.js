'use strict';

//On récupère des classes ici
const { Client, Intents } = require('discord.js');
const CommandsManager = require('./src/utils/CommandsManager.js');
const EventsManager = require('./src/utils/EventsManager.js');
const Logger = require('./src/utils/Logger.js');

//Création de notre classe Bot qui est la principale et qui est étendu de Client
class Bot extends Client {
    constructor() {
        //On passe les options à la classe Client : https://discord.js.org/#/docs/main/stable/class/Client
        //Listes des options : https://discord.js.org/#/docs/main/stable/typedef/ClientOptions
        super({
            messageCacheMaxSize: 15,
			messageCacheLifetime: 300,
			messageSweepInterval: 60,
			fetchAllMembers: false,
            disableEveryone: true,
            intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_BANS, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_INTEGRATIONS, Intents.FLAGS.GUILD_MESSAGES]
        });
        
        this.config = require('./config.json');//récupérer la config
        this.prefix = 'bot!';
        //on définit notre logger comme ca on a la date dans la console et des couleurs
        this.logger = new Logger("Shard #"+this.shard.ids);
        //regarder aux classes suivantes pour + d'infos
        this.events = new EventsManager(this);

        this.launch().then(() => {
            this.logger.sucess("All was sucessfuly launched");
        }).catch(err => {
            this.logger.error(`[LaunchError] An error occured at startup ${err}`);
        })
        
    }

    async launch() {
        //On load nos events
        await this.events.loadEvent();
        this.logger.sucess(`[Events] Loaded ${this.events.events.size} events`);

        try {
            await this.login(this.config.bot.token);
            this.logger.sucess("[WS] Connected to discord");
        } catch (error) {
            this.logger.error(`[WS] Connection error: ${e}`);
            return process.exit(1);
        }

        this.commands = new CommandsManager(this);
        //On load nos commandes
        await this.commands.loadCommands();
        this.logger.sucess(`[Commands] Loaded ${this.commands.commands.size} commands`);

    }

}

module.exports = new Bot;