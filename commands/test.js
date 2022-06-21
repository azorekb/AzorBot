module.exports = async (aMessage, client, con, interaction = null) => 
{
    const reply = (stuffs) => {if(interaction){interaction.reply(stuffs);}else{aMessage.message.channel.send(stuffs);}}
    const serverID = interaction ? interaction.guildId : aMessage.message.guildId;

    reply(serverID);
}