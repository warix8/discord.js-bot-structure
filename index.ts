"use strict";

import Bot from "./main";

new Bot();

process.on("unhandledRejection", (reason) => {
    console.error(reason);
});