"use strict";

// ici on gère nos commandes pour les charger ou en trouver une avec la fonction findCommand pour une command help

import Bot from "../../main";
import { resolve } from "path";
import { Collection, ApplicationCommandManager } from "discord.js";
import { access, readdir, stat } from "fs/promises";
import Command from "../utils/base/Command";

class CommandsManager {
	private _client: Bot;
	private _commands: Collection<string, Command>;
	private _path: string;
	private _globalCommands: ApplicationCommandManager;
	constructor(client: Bot) {
		this._client = client;
		this._commands = new Collection();
		this._path = resolve(__dirname, "..", "commands");
		if (!this._client.application) throw new Error("Appication is null");
		this._globalCommands = this._client.application.commands;
	}

	get commands() {
		return this._commands;
	}

	addCommand(command: Command) {
		this._commands.set(command.name.toLowerCase(), command);
	}

	findCommand(name: string) {
		if (!name || typeof name !== "string") return undefined;
		return this._commands.find(cmd => {
			return cmd.name.toLowerCase() === name.toLowerCase();
		});
	}

	async loadCommands() {
		try {
			await access(this._path);
		} catch (error) {
			return;
		}

		await this._globalCommands.fetch();

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
								// eslint-disable-next-line @typescript-eslint/no-var-requires
								this.addCommand(require(cmdPath));
							}
						}
					}
				}
			}
		}

		await this._globalCommands.set(
			this._commands
				.filter(cmd => cmd.testCmd)
				.map(cmd => {
					return {
						name: cmd.name,
						description: cmd.description,
						options: cmd.options
					};
				}),
			this._client.config.testGuild
		);

		await this._globalCommands.set(
			this._commands
				.filter(cmd => !cmd.testCmd)
				.map(cmd => {
					return {
						name: cmd.name,
						description: cmd.description,
						options: cmd.options
					};
				})
		);
	}
}

export default CommandsManager;
