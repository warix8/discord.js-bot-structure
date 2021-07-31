'use strict';

const CommandService = require("../services/CommandService");

/*
L'évent messsage n'est pas lon car en faites les tâches sont répartis dans le dossier services prenez exemple sur CommandService ;)
*/

class InteractionCreate {
    constructor(client) {
        this.client = client;
        this.name = "interactionCreate";
        this.commands = new CommandService(this.client);
    }

    async run (interaction) {
        await this.commands.handle(interaction);
    }
}

module.exports = InteractionCreate;