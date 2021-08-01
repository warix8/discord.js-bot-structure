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

    /*static bootstrap (client: typeof Client) {
        throw new Error(`You must create a bootstrap method into your ${this.name} event class`);
    }*/

    abstract run (...args: any[]) : void;

}

export default DiscordEvent;