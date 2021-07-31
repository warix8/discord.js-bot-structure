'use strict';

/*
Ca va paraitre énervent au début mais c'est super utile ! Au lieu de faire à chaque fois dans vos commandes 
Au lieu de message, ou client ca sera -> ctx.message ou ctx.client
Avantages: 
Au lieu de faire message.guild.members.cache.get(message.author.id); dans vos commandes
ctx.member; utile non ? 
remplacer aussi ctx.message.channel.send() par ctx.send(); !
*/
class Context {
    constructor(client, interaction) {
        this.interaction = interaction;
        this.client = client;
        this.args = interaction.options;
        this.lang = client.config.mainLang;
        if(this.client?.shard){
            this.shard = this.client.shard
        }
    }
    
    get shards(){
        if(!this.shard) throw new Error('Shard non trouvable')
        return this.shard
    }

    get guild () {
        return this.interaction.guild;
    }

    get channel () {
        return this.interaction.channel;
    }

    get author () {
        return this.interaction.user;
    }

    get member () {
        return this.interaction.member;
    }

    get me () {
        return (this.guild ? this.guild.members.cache.get(this.client.user.id) : undefined);
    }

    reply (...content) {
        return this.interaction.reply(...content); // for embed or file or simple message
    }
    
    defer (...args) {
        this.interaction.defer(...args);
    }

    /*sendRichMessage (content,data) {
        return this.channel.send(content,data); // for simple message plus embed plus/or file
    }*/
}

module.exports = Context;
