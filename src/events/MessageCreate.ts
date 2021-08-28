"use strict";


import type {Interaction} from "discord.js";
import type Client from "../../main";
import ClassicCommandService from "../services/ClassicCommandService";
import DiscordEvent from "../utils/DiscordEvent";
import {Message} from "discord.js";

/*
L'évent interactionCreate n'est pas long car en faites les tâches sont répartis dans le dossier services prenez exemple sur CommandService ;)
*/

class InteractionCreate extends DiscordEvent {
    classic_commands: ClassicCommandService;

    constructor(client: typeof Client) {
        super(client, "messageCreate");
        this.client = client;
        this.classic_commands = new ClassicCommandService(this.client);
    }

    async run(message: Message) {
        const args = message.content.slice(this.client.config.prefix.length).trim().split(/ +/g);
        const command = this.client.classic_commands.findCommand(args[0].toLowerCase(), true) || this.client.classic_commands.findCommand(args[0].toLowerCase());
        args.shift().toLowerCase();
        if (command) await this.classic_commands.handle(message, command.name, args);
    }
}

module.exports = InteractionCreate;