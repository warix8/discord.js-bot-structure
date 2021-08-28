"use strict";

import Command from "../../utils/Command";
import Context from "../../utils/Context";

class Ping extends Command {
    constructor() {
        super({
            name: "ping",
            category: "utils",
            description: "Say PONG !",
            options: [],
        });
    }

    async run(ctx: Context){
        await ctx.reply('PONG !');
    }

}

module.exports = new Ping();
