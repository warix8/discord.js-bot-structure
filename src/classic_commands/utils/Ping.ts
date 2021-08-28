"use strict";

import ClassicCommand from "../../utils/ClassicCommand";
import ClassicContext from "../../utils/ClassicContext";

class Ping extends ClassicCommand {
    constructor() {
        super({
            name: "ping",
            category: "utils",
            description: "Say PONG !",
            options: [],
        });
    }

    async run(ctx: ClassicContext){
        await ctx.channel.send('PONG !');
    }

}

module.exports = new Ping();
