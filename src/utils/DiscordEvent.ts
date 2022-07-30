"use strict";

import type Client from "../../main";

abstract class DiscordEvent {
	client: typeof Client;
	name: string;
	constructor(client: typeof Client, name: string) {
		if (this.constructor === DiscordEvent) throw new Error("Event class is an abstract class");
		this.client = client;
		this.name = name;
	}

	// eslint-disable-next-line no-unused-vars
	abstract run(...args: unknown[]): void;
}

export default DiscordEvent;
