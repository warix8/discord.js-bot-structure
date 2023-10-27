"use strict";

import Bot from "../../../main";

abstract class Service {
	protected _client: Bot;

	constructor(client: Bot) {
		this._client = client;
	}

	// eslint-disable-next-line no-unused-vars
	abstract handle(...args: unknown[]): void;
}

export default Service;
