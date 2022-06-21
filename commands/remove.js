const EMOJIS = require('../jsony/emoji.json');
module.exports = async (aMessage, client, con, interaction = null) => 
{
    if(interaction && interaction.guild == null){interaction.reply('It can\'t be used in DM'); return;}
    const VoiceChannel = interaction ? interaction.member.voice.channel : aMessage.message.member.voice.channel;
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
    const serverID = interaction ? interaction.guildId : aMessage.message.guildId;
    const guildQueue = client.player.getQueue(serverID);
    const theArgument = interaction ? interaction.options.getInteger('song') : aMessage.arguments.join(' ');
    if(VoiceChannel == null)
    {
        reply({content: 'You must be in the Voice Channel first. ' + EMOJIS.dunno, ephemeral: true});
        return false;
    }
    if(guildQueue == undefined){reply({content: 'What you want to remove? ' + EMOJIS.think, ephemeral: true}); return false;}
    if(interaction == null){client.bwe.deleteMessage(aMessage.message);}
    if(theArgument == undefined){reply({content: 'Write number of song you want to remove. ' + EMOJIS.sip, ephemeral: true}); return false;}
    if(isNaN(theArgument * 1)){reply({content: 'Argument must be number. ' + EMOJIS.hide, ephemeral: true}); return false;}
    if(theArgument * 1 > guildQueue.songs.length || theArgument * 1 < 1){reply({content: 'Umm... i think there is no song with that number... ' + EMOJIS.think, ephemeral: true}); return false;}
    
    const MsgToDelete = await reply({content: 'I deleted  **' + guildQueue.songs[theArgument * 1 - 1].name + '** from the list. ' + EMOJIS.sit, ephemeral: true});
    if(interaction == null){setTimeout(() => MsgToDelete.delete(), 2500);} 
    guildQueue.remove(theArgument * 1 - 1);
}
    