"use strict";

class Logger {
    loggerTitle: string;
    private _types: { [key: string]: string };
    private _originalConsole: Console;
    constructor(title: string){
        this.loggerTitle = title;
        this._types = {
            log: "\x1b[37m",
            info: "\x1b[34m",
            sucess: "\x1b[32m",
            debug: "\x1b[35m",
            warn: "\x1b[33m",
            error: "\x1b[31m"
        },
        this._originalConsole = Object.assign({}, console);
        this._init();
    }

    _init() {
        for(const type of Object.keys(this._types)){
            // @ts-ignore
            this[type] = (...content: any): void => {
                this._originalConsole.log("\x1b[40m", this._getDate(), this._types[type], `[${this.loggerTitle}]`, ...content, "\x1b[0m");
            };
            // @ts-ignore
            console[type] = (...content: any): void => {
                // @ts-ignore
                this[type](...content);
            };
        }
    }

    log(...content: any[]): void {}
    info(...content: any[]): void {}
    sucess(...content: any[]): void {}
    debug(...content: any[]): void {}
    warn(...content: any[]): void {}
    error(...content: any[]): void {}

    _getDate() {
        return `[${new Date(Date.now()).toLocaleString("FR-fr", { timeZone: "Europe/Paris" })}]`;
    }
}

export default Logger;
