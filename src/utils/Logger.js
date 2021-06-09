'use strict';

const chalk = require("chalk");

class Logger {
    constructor(title){
        this.loggerTitle = title;
        this._types = {
            log: "white",
            info: "blue",
            sucess: "green",
            debug: "magenta",
            warn: "yellow",
            error: "red"
        },
        this._originalConsole = Object.assign({}, console);
        this._init();
    }

    _init() {
        for(const type in this._types){
            console.log(type)
            this[type] = (content) => {
                this._originalConsole.log(this._getDate() + chalk.bgBlack[this._types[type]](`[${this.loggerTitle}] ${content}`));
            }
            console[type] = (content) => {
                this[type](content);
            }
        }
    }

    _getDate() {
        return chalk.gray(`[${new Date(Date.now()).toLocaleString("FR-fr", { timeZone: "Europe/Paris" })}]`)
    }
}

module.exports = Logger;
