"use strict";

import Bot from "../../../main";

abstract class Service {
    protected _client: typeof Bot;

    constructor(client: typeof Bot) {
        this._client = client;
    }

    // eslint-disable-next-line no-unused-vars
    abstract handle(...args: unknown[]): void;
}

export default Service;