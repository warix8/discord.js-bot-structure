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
    constructor(client, message, args) {
        this.message = message;
        this.client = client;
        this.args = args;
        this.prefix = client.prefix;
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
        return this.message.guild;
    }

    get channel () {
        return this.message.channel;
    }

    get author () {
        return this.message.author;
    }

    get member () {
        return this.guild.members.cache.get(this.author.id);
    }

    get me () {
        return (this.guild ? this.guild.members.cache.get(this.client.user.id) : undefined);
    }

    send (content) {
        return this.channel.send(content); // for embed or file or simple message
    }

    sendRichMessage (content,data) {
        return this.channel.send(content,data); // for simple message plus embed plus/or file
    }
}

module.exports = Context;
