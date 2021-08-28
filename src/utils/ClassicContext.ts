"use strict";

import {
    Guild, ShardClientUtil, TextChannel, NewsChannel, ThreadChannel, User, GuildMember, GuildChannel, Message
} from "discord.js";
import Client from "../../main";

/*
Ca va paraitre énervent au début mais c'est super utile ! Au lieu de faire à chaque fois dans vos commandes
Au lieu de message, ou client ca sera -> ctx.message ou ctx.client
Avantages:
Au lieu de faire message.guild.members.cache.get(message.author.id); dans vos commandes
ctx.member; utile non ?
remplacer aussi ctx.message.channel.send() par ctx.send(); !
*/
class ClassicContext {
    message: Message;
    client: typeof Client;
    args: Array<string>;
    lang: string;

    constructor(client: typeof Client, message: Message, args: Array<string>) {
        this.message = message;
        this.client = client;
        this.args = args;
        this.lang = client.config.mainLang;
    }

    get shards(): ShardClientUtil {
        if (!this.client?.shard) throw new Error("Shard non trouvable");
        return this.client.shard;
    }

    get guild(): Guild {
        if (!this.message.guild) throw new Error("Not a guild");
        return this.message.guild;
    }

    get channel(): TextChannel | NewsChannel | ThreadChannel {
        if (!this.message.channel || !this.message.guild) throw new Error("Not a guild channel");
        if (!(this.message.channel instanceof GuildChannel) &&
            !(this.message.channel instanceof ThreadChannel)) throw new Error("This is not a GuildTextChannel");
        return this.message.channel;
    }

    get author(): User {
        return this.message.author;
    }

    get member(): GuildMember | any {
        return this.message.member;
    }

    get me(): GuildMember {
        return this.guild.me;
    }

}

export default ClassicContext;
