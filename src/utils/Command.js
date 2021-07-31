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
        this.options = info.options || [];
        this.example = info.example || [];

        this.userPerms = info.userPerms || [];
        this.botPerms = info.botPerms || [];
        this.disabled = info.disabled || false;
        this.ownerOnly = info.ownerOnly || false;
        this.guildOnly = info.guildOnly || false;
        this.testCmd = info.testCmd || false;
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