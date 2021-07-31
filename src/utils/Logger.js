'use strict';

class Logger {
    constructor(title){
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
        for(const type in this._types){
            this[type] = (...content) => {
                this._originalConsole.log(this._getDate(), this._types[type], `[${this.loggerTitle}]`, ...content, "\x1b[0m");
            }
            console[type] = (...content) => {
                this[type](...content);
            }
        }
    }

    _getDate() {
        return "\x1b[40m", `[${new Date(Date.now()).toLocaleString("FR-fr", { timeZone: "Europe/Paris" })}]`
    }
}

module.exports = Logger;
