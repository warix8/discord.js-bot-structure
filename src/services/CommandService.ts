"use strict";

import type Client from "../../main";
import { CommandInteraction } from "discord.js";
import Context from "../utils/Context";

class CommandService {
    client: typeof Client;
    constructor(client: typeof Client) {
        this.client = client;
    }

    async handle (interaction: CommandInteraction) {
        if (interaction.user.bot || !interaction.inGuild()) return;

        const guild = interaction.guild;

        // Est ce que le bot peut parler ?
        // if(!interaction.channel.isTextBased()) throw new Error("This is not a GuildTextChannel");
        const channelBotPerms = interaction.channel?.permissionsFor(guild.members.me);

        // if (!me.hasPermission("SEND_MESSAGES") || !channelBotPerms.has("SEND_MESSAGES")) return;

        const command = this.client.commands.findCommand(interaction.commandName);

        if(!command) return;

        // Si la commande est juste pour les créateurs on l'éxecute pas :(
        if (command.ownerOnly && !this.client.config.bot.ownersIDs.includes(interaction.user.id)) {
            return interaction.reply("You can't use this command, it's for my creator.");
        }

        // Si la commande demande des permissions aux utilisateurs
        if (command.userPerms.length > 0 && !command.userPerms.some(p => guild.members.cache.get(interaction.user.id).permissions.has(p) )) {
            return interaction.reply(`You must have \`${command.userPerms.join("`, `")}\` permissions to execute this command.`);
        }

        if (!guild.members.me.permissions.has("EmbedLinks") || !channelBotPerms.has("EmbedLinks")) return interaction.reply("The bot must have the `EMBED_LINKS` permissions to work properly !");

        // Si le bot manques de permissions
        if (command.botPerms.length > 0 && !command.botPerms.every(p => guild.members.me.permissions.has(p) && channelBotPerms.has(p))) {
            return interaction.reply(`The bot must have \`${command.botPerms.join("`, `")}\` permissions to execute this command.`);
        }

        // Si la commande est désactivée
        if(command.disabled && !this.client.config.bot.ownersIDs.includes(interaction.user.id)){
            return interaction.reply("Sorry but this command was temporarly disabled.");
        }

        const ctx = new Context(this.client, interaction);

        try {
            await command.run(ctx);
            this.client.logger.info(`Command ${command.name} executed by ${ctx.member.user.username} in ${ctx.guild.name}`);
        } catch (error) {
            // faites quelque chose si il y a une erreur sur une commande
            interaction.reply("Sorry but, an error was occured.");
            this.client.logger.error(error);
        }
    }
}

export default CommandService;