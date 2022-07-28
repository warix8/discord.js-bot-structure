/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
"use strict";

declare global {
    interface Console {
        success(...args: unknown[]): void;
    }
}

type LoggerTypes =
| "log"
| "info"
| "success"
| "debug"
| "warn"
| "error";

class Logger {
    loggerTitle: string;
    private _types: { [P in LoggerTypes]: string };
    private _originalConsole: Console;
    constructor(title: string){
        this.loggerTitle = title;
        this._types = {
            log: "\x1b[37m",
            info: "\x1b[34m",
            success: "\x1b[32m",
            debug: "\x1b[35m",
            warn: "\x1b[33m",
            error: "\x1b[31m"
        },
        this._originalConsole = Object.assign({}, console);
        this._init();
    }

    private _init() {
        for(const [type, color] of Object.entries(this._types) as [LoggerTypes, string][]){
            this[type] = (...content: never[]): void => {
                this._originalConsole.log("\x1b[40m", this._getDate(), color, `[${this.loggerTitle}]`, ...content, "\x1b[0m");
            };
            console[type] = (...content: never[]): void => {
                this[type](...content);
            };
        }
    }

    log(...content: unknown[]): void {
        // do nothing.
    }
    info(...content: unknown[]): void {
        // do nothing.
    }
    success(...content: unknown[]): void {
        // do nothing.
    }
    debug(...content: unknown[]): void {
        // do nothing.
    }
    warn(...content: unknown[]): void {
        // do nothing.
    }
    error(...content: unknown[]): void {
        // do nothing.
    }

    private _getDate() {
        return `[${new Date(Date.now()).toLocaleString("FR-fr", { timeZone: "Europe/Paris" })}]`;
    }
}

export default Logger;
