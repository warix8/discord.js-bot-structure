"use strict";

// ici on gère nos commandes pour les charger ou en trouver une avec la fonction findCommand pour une command help

import Client from "../../main";
import {resolve} from "path";
import {Collection, ApplicationCommandManager} from "discord.js";
import {access, readdir, stat} from "fs/promises";
import ClassicCommand from "./ClassicCommand";
import {type} from "os";

class ClassicCommandsManager {
    private _client: typeof Client;
    private _commands: Collection<string, ClassicCommand>;
    private _path: string;
    private _globalCommands: ApplicationCommandManager;

    constructor(client: typeof Client) {
        this._client = client;
        this._commands = new Collection();
        this._path = resolve(__dirname, "..", "classic_commands");
    }

    get commands() {
        return this._commands;
    }

    addCommand(command: ClassicCommand) {
        this._commands.set(command.name.toLowerCase(), command);
    }

    findCommand(name: string, aliases?: boolean) {
        if (!name || typeof name !== 'string') return undefined
        if (aliases) return this._commands.find((cmd) => {
            return cmd?.aliases?.includes(name)
        })
        else return this._commands.find((cmd) => {
            return cmd.name?.toLowerCase() === name.toLowerCase();
        });
    }

    async loadCommands() {
        try {
            await access(this._path);
        } catch (error) {
            return;
        }

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

export default ClassicCommandsManager;