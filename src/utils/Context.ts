"use strict";

import { CommandInteraction, CommandInteractionOptionResolver, Guild, ShardClientUtil, TextChannel,
    NewsChannel, ThreadChannel, User, GuildMember, InteractionReplyOptions, MessagePayload, InteractionDeferOptions, GuildChannel
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
class Context {
    interaction: CommandInteraction;
    client: typeof Client;
    args: CommandInteractionOptionResolver;
    lang: string;

    constructor(client: typeof Client, interaction: CommandInteraction) {
        this.interaction = interaction;
        this.client = client;
        this.args = interaction.options;
        this.lang = client.config.mainLang;
    }
    get shards(): ShardClientUtil {
        if(!this.client?.shard) throw new Error("Shard non trouvable");
        return this.client.shard;
    }

    get guild (): Guild {
        if(!this.interaction.guild) throw new Error("Not a guild");
        return this.interaction.guild;
    }

    get channel (): TextChannel | NewsChannel | ThreadChannel {
        if(!this.interaction.channel || !this.interaction.guild) throw new Error("Not a guild channel");
        if(!(this.interaction.channel instanceof GuildChannel)) throw new Error("This is not a GuildTextChannel");
        return this.interaction.channel;
    }

    get author (): User {
        return this.interaction.user;
    }

    get member (): GuildMember | any {
        return this.interaction.member;
    }

    get me (): GuildMember {
        return this.guild.me;
    }

    reply (content: string | MessagePayload | InteractionReplyOptions) {
        return this.interaction.reply(content); // for embed or file or simple message
    }

    defer (options?: InteractionDeferOptions) {
        this.interaction.defer(options);
    }

    /*sendRichMessage (content,data) {
        return this.channel.send(content,data); // for simple message plus embed plus/or file
    }*/
}

export default Context;
