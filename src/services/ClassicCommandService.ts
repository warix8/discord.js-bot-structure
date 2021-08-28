"use strict";

import type Client from "../../main";
import {CommandInteraction, GuildChannel, Message, Permissions, TextBasedChannel, ThreadChannel} from "discord.js";
import ClassicContext from "../utils/ClassicContext";

class ClassicCommandService {
    client: typeof Client;
    constructor(client: typeof Client) {
        this.client = client;
    }

    async handle (message: Message, commandName: string, args: Array<string>) {
        if (message.author.bot || !message.guild) return;

        const guild = message.guild;

        // Est ce que le bot peut parler ?
        if(!(message.channel instanceof GuildChannel) &&
        !(message.channel instanceof ThreadChannel)) throw new Error("This is not a GuildTextChannel");
        const channelBotPerms = new Permissions(message.channel?.permissionsFor(guild.me));

        // if (!me.hasPermission("SEND_MESSAGES") || !channelBotPerms.has("SEND_MESSAGES")) return;

        const command = this.client.classic_commands.findCommand(commandName);

        if(!command) return;

        // Si la commande est juste pour les créateurs on l'éxecute pas :(
        if (command.ownerOnly && !this.client.config.bot.ownersIDs.includes(message.author.id)) {
            return message.reply(`You can't use this command, it's for my creator.`);
        }

        // Si la commande demande des permissions aux utilisateurs
        if (command.userPerms.length > 0 && !command.userPerms.some(p => guild.members.cache.get(message.author.id).permissions.has(p) )) {
            return message.reply(`You must have \`${command.userPerms.join("`, `")}\` permissions to execute this command.`);
        }

        if (!guild.me.permissions.has("EMBED_LINKS") || !channelBotPerms.has("EMBED_LINKS")) return message.reply("The bot must have the `EMBED_LINKS` permissions to work properly !");

        // Si le bot manques de permissions
        if (command.botPerms.length > 0 && !command.botPerms.every(p => guild.me.permissions.has(p) && channelBotPerms.has(p))) {
            return message.reply(`The bot must have \`${command.botPerms.join("`, `")}\` permissions to execute this command.`);
        }

        // Si la commande est désactivée
        if(command.disabled && !this.client.config.owners.includes(message.author.id)){
            return message.reply(`Sorry but this command was temporarly disabled.`);
        }

        const ctx = new ClassicContext(this.client, message, args);

        try {
            await command.run(ctx);
            this.client.logger.info(`Command ${command.name} executed by ${ctx.member.user.username} in ${ctx.guild.name}`);
        } catch (error) {
            // faites quelque chose si il y a une erreur sur une commande
            message.reply(`Sorry but, an error was occured.`);
            this.client.logger.error(error);
        }
    }
}

export default ClassicCommandService;