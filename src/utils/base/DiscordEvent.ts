"use strict";

import type Bot from "../../../main";

abstract class DiscordEvent {
	client: Bot;
	name: string;
	constructor(client: Bot, name: string) {
		if (this.constructor === DiscordEvent) throw new Error("Event class is an abstract class");
		this.client = client;
		this.name = name;
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(...args: unknown[]): void;
}

export default DiscordEvent;
