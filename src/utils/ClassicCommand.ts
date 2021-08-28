"use strict";

import type { ApplicationCommandOptionData } from "discord.js";
import type ClassicContext from "./ClassicContext";

/*
La classe commandes très utiles surtout utilisez les paramètres ci-dessous pour vous simplifier la vie
Au lieu de mettre member.hasPermissions à plein d'endroit le bot executera des test en fonction des options de votre commandes !
*/

interface CommandInfo {
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
    aliases?: Array<string>
}

export default abstract class Command {
    name: string;
    description: string;
    category: string;
    options: ApplicationCommandOptionData[];
    examples: string[];
    userPerms: bigint[];
    botPerms: bigint[];
    disabled: boolean;
    ownerOnly: boolean;
    guildOnly: boolean;
    testCmd: boolean;
    aliases: Array<string>;
    constructor(info: CommandInfo) {
        this.name = info.name;
        this.category = info.category;
        this.description = info.description;
        this.options = info.options || [];
        this.examples = info.examples || [];

        this.userPerms = info.userPerms || [];
        this.botPerms = info.botPerms || [];
        this.disabled = info.disabled || false;
        this.ownerOnly = info.ownerOnly || false;
        this.guildOnly = info.guildOnly || false;
        this.testCmd = info.testCmd || false;
        this.aliases = info.aliases || []
        // this.cooldown = info.cooldown || 0; Si vous voulez faire votre système de cooldown ;)
    }

    abstract run(ctx: ClassicContext): void;
}