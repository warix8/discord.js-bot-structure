"use strict";

import Bot from "../../main";
import { ClientEvents, Collection } from "discord.js";
import { resolve } from "path";
import type DiscordEvent from "./DiscordEvent";

// ici on gère nos events pour les charger etc.

import { access, readdir, stat } from "fs/promises";

class EventsManager {
	private _client: Bot;
	private _events: Collection<string, DiscordEvent<keyof ClientEvents>>;
	private _path: string;

	constructor(client: Bot) {
		this._client = client;
		this._events = new Collection();
		this._path = resolve(__dirname, "..", "events");
	}

	get events(): Collection<string, DiscordEvent<keyof ClientEvents>> {
		return this._events;
	}

	addEvent(event: DiscordEvent<keyof ClientEvents>) {
		this._events.set(event.name.toLowerCase(), event);
		this._client.on(event.name, event.run.bind(event));
	}

	async loadEvent() {
		try {
			await access(this._path);
		} catch (error) {
			return console.error(error);
		}

		const events = await readdir(this._path);

		if (events && events.length > 0) {
			for (const event of events) {
				const path = resolve(this._path, "", event);
				const stats = await stat(path);

				if (event !== "Event.js" && stats.isFile() && event.endsWith(".js")) {
					// eslint-disable-next-line @typescript-eslint/no-require-imports
					this.addEvent(new (require(path).default)(this._client));
					delete require.cache[require.resolve(path)];
				}
			}
		}
	}
}

export default EventsManager;
