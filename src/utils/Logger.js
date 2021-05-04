'use strict';

const chalk = require("chalk");

class Logger {
    constructor(title){
        this.loggerTitle = title;
    }

    info(content) {
        return console.log(this.getDate() + chalk.bgBlack.blue(`[${this.loggerTitle}] ${content}`));
    }

    sucess(content){
        return console.log(this.getDate() + chalk.bgBlack.green(`[${this.loggerTitle}] ${content}`));
    }

    error(content) {
        return console.error(this.getDate() + chalk.bgBlack.red(`[${this.loggerTitle}] ${content}`));
    }

    getDate() {
        return chalk.gray(`[${new Date(Date.now()).toLocaleString("FR-fr", { timeZone: "Europe/Paris" })}]`)
    }
}

module.exports = Logger;
