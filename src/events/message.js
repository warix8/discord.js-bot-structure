'use strict';

const CommandService = require("../services/CommandService");

/*
L'évent messsage n'est pas lon car en faites les tâches sont répartis dans le dossier services prenez exemple sur CommandService ;)
*/

class Message {
    constructor(client) {
        this.client = client;
        this.name = "message";
        this.commands = new CommandService(this.client);
    }

    async run (message) {
        if (message.author.bot || !message.channel.guild) return;

        await this.commands.handle(message);
    }
}

module.exports = Message;