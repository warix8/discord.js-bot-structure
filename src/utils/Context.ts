"use strict";

import type { CommandInteraction, CommandInteractionOptionResolver, Guild, ShardClientUtil, TextChannel,
    NewsChannel, ThreadChannel, User, GuildMember, InteractionReplyOptions, MessagePayload, InteractionDeferOptions
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
        // @ts-ignore
        return this.interaction.channel;
    }

    get author (): User {
        return this.interaction.user;
    }

    get member (): GuildMember | any {
        return this.interaction.member;
    }

    get me (): GuildMember | null {
        return this.guild?.members.cache.get(this.client.user?.id) ?? null;
    }

    reply (content: string | MessagePayload | InteractionReplyOptions) {
        return this.interaction.reply(content); // for embed or file or simple message
    }

    defer (options?: InteractionDeferOptions) {
        this.interaction.defer(options);
    }
    
    followUp (content: string | MessagePayload | InteractionReplyOptions) {
        return this.interaction.followUp(content);
    }

    editReply (content: string | MessagePayload | InteractionReplyOptions) {
        return this.interaction.editReply(content);
    }

     deleteReply (): Promise<void> {
        return this.interaction.deleteReply();
    }

    /*sendRichMessage (content,data) {
        return this.channel.send(content,data); // for simple message plus embed plus/or file
    }*/
}

export default Context;
