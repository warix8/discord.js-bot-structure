'use strict';

//ici on gère nos events pour les charger etc.

const { resolve } = require("path");
const { Collection } = require("discord.js");
const { access, readdir, stat } = require("fs/promises");

class EventsManager {
    constructor(client) {
        this._client = client;
        this._events = new Collection();
        // eslint-disable-next-line no-undef
        this._path = resolve(__dirname, "..", "events");
    }

    get events() {
        return this._events;
    }

    addEvent(event) {
        this._events.set(event.name.toLowerCase(), event);
        this._client.on(event.name, event.run.bind(event));
        delete require.cache[require.resolve(this._path + "\\" + event.name)];
    }

    async loadEvent() {
        try {
            await access(this._path);
        } catch (error) { return; }

        const events = await readdir(this._path);
        
        if (events && events.length > 0) {
            for (const event of events) {
                const path = resolve(this._path, event);
                const stats = await stat(path);

                if (event !== "Event.js" && stats.isFile() && event.endsWith(".js")) {
                    this.addEvent(new(require(path))(this._client));
                }
            }
        }
    }
}

module.exports = EventsManager;