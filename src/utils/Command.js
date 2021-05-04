'use strict';

const { GuildMember } = require("discord.js");
const Context = require("./Context");

/*
La classe commandes très utiles surtout utilisez les paramètres ci-dessous pour vous simplifier la vie
Au lieu de mettre member.hasPermissions à plein d'endroit le bot executera des test en fonction des options de votre commandes !
*/

module.exports = class Command {
    constructor(info) {
        this.name = info.name;
        this.category = info.category;
        this.description = info.description;
        this.usage = info.usage || [info.name];
        this.example = info.example || [];
        this.aliases = info.aliases || [];

        this.userPerms = info.userPerms || [];
        this.botPerms = info.botPerms || [];
        this.disabled = false;
        this.ownerOnly = false;
        //this.cooldown = info.cooldown || 0; Si vous voulez faire votre système de cooldown ;)
    }

    /**
     * @param {Context} ctx - The context
     * @returns {GuildMember|undefined} - The output
     */
    searchMember(ctx) {
        //do something to search you member with the ctx.args
    }
};