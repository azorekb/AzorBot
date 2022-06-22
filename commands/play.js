const EMOJIS = require('../jsony/emoji.json');
module.exports = async (aMessage, client, con, interaction = null) => 
{
    try
    {
        if(interaction && interaction.guild == null){interaction.reply('It can\'t be used in DM'); return;}
        const VoiceChannel = interaction ? interaction.member.voice.channel : aMessage.message.member.voice.channel;
        const reply = (stuffs) => {if(interaction){interaction.reply(stuffs);}else{aMessage.message.channel.send(stuffs);}}
        const permissions = interaction ? interaction.channel.permissionsFor(interaction.guild.me).toArray() : aMessage.message.member.voice.channel.permissionsFor(aMessage.message.guild.me).toArray();
        const theArgument = interaction ? interaction.options.getString('song') : aMessage.arguments.join(' ');
        const serverID = interaction ? interaction.guildId : aMessage.message.guildId;
        const channel = interaction ? interaction.channel : aMessage.message.channel;
        let messageToEdit;
     
        if(VoiceChannel == null)
        {
            reply({content: 'You must be in the Voice Channel first. ' + EMOJIS.dunno, ephemeral: true});
            return false;
        }
        if(permissions.indexOf('CONNECT') == -1)
        {
            reply({content:'I don\'t have permissions to join voice channel. ' + EMOJIS.hide, ephemeral: true});
            return false;
        }
        if(permissions.indexOf('SPEAK') == -1)
        {
            reply({content:'I don\'t have permissions to play songs (let me speak). ' + EMOJIS.hide, ephemeral: true});
            return false;
        }
    
        if(theArgument == undefined)
        {
            reply({content:'Tell me what you want~ ' + EMOJIS.sip, ephemeral: true});
            return false;
        }
        if(interaction)
        {
            interaction.deferReply();
            interaction.deleteReply();
        }
        else
        {
            client.bwe.deleteMessage(aMessage.message);
        }
        messageToEdit = await channel.send('Looking for song... ' + EMOJIS.lagging);
        let queue = client.player.createQueue(serverID);
        await queue.join(VoiceChannel);
        let song = await queue.play(theArgument).catch((_) => {});
        if(song == undefined)
        {
            messageToEdit.edit('Sorry, i couldn\'t find this... ' + EMOJIS.hide);
        }
        else
        {
            messageToEdit.edit('Song added to queue ' + EMOJIS.vibbing);
        }
        setTimeout(() => {client.bwe.deleteMessage(messageToEdit);}, 3000);
        if(client.queueMessages.get(serverID) == null)
        {
            const run = require('./queue');
            run(aMessage, client, con, interaction);
            delete require.cache[require.resolve('./queue')];
        }
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}