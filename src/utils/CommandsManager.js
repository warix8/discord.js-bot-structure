'use strict';

//ici on gère nos commandes pour les charger ou en trouver une avec la fonction findCommand pour une command help

const { resolve } = require("path");
const { Collection } = require("discord.js");
const { access, readdir, stat } = require("fs/promises");

class CommandsManager {
    constructor(client) {
        this._client = client;
        this._commands = new Collection();
        // eslint-disable-next-line no-undef
        this._path = resolve(__dirname, "..", "commands");
    }

    get commands() {
        return this._commands;
    }

    addCommand(command) {
        this._commands.set(command.name.toLowerCase(), command);
    }

    findCommand(name) {
        if (!name || typeof name !== "string") return null;
        return this._commands.find((cmd) => {
            return (cmd.name.toLowerCase() === name.toLowerCase() || cmd.aliases.map(a => a.toLowerCase()).includes(name.toLowerCase()));
        });
    }

    async loadCommands() {
        try {
            await access(this._path);
        } catch (error) { return; }

        const categorys = await readdir(this._path);

        if (!categorys || categorys.length > 0) {
            for (const category of categorys) {
                const path = resolve(this._path, category);
                const stats = await stat(path);

                if (stats.isDirectory()) {
                    const commands = await readdir(path);

                    if (commands && commands.length > 0) {
                        for (const command of commands) {
                            const cmdPath = resolve(path, command);
                            const cmdStats = await stat(cmdPath);

                            if (cmdStats.isFile() && command.endsWith(".js")) {
                                this.addCommand(require(cmdPath));
                            }
                        }
                    }
                }
            }
        }
    }
}

module.exports = CommandsManager;