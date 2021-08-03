"use strict";

declare global {
    interface Console {
        success(...args: any): void;
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
            this[type] = (...content: any): void => {
                this._originalConsole.log("\x1b[40m", this._getDate(), color, `[${this.loggerTitle}]`, ...content, "\x1b[0m");
            };
            console[type] = (...content: any): void => {
                this[type](...content);
            };
        }
    }

    log(...content: any[]): void {}
    info(...content: any[]): void {}
    success(...content: any[]): void {}
    debug(...content: any[]): void {}
    warn(...content: any[]): void {}
    error(...content: any[]): void {}

    private _getDate() {
        return `[${new Date(Date.now()).toLocaleString("FR-fr", { timeZone: "Europe/Paris" })}]`;
    }
}

export default Logger;
