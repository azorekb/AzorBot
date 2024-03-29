const EMOJIS = require('../jsony/emoji.json');
function musicReact(message)
{
    message.react(EMOJIS.pausePlay);
    message.react(EMOJIS.shuffle);
    message.react(EMOJIS.up);
    message.react(EMOJIS.down);
    message.react(EMOJIS.skip);
    message.react(EMOJIS.loop1);
    message.react(EMOJIS.loop2);
    message.react(EMOJIS.stop);
}

module.exports = async (message, arguments, client, con, interaction = null) => 
{
    try
    {
        if(interaction && interaction.guild == null){interaction.reply('It can\'t be used in DM'); return;}
        const channel = interaction ? interaction.channel : message.channel;
        const serverID = interaction ? interaction.guildId : message.guildId;
        const MSG = client.bwe.createQueueMessage(serverID, client);
        if(interaction)
        {
            interaction.deferReply();
            interaction.deleteReply();
        }
        let queueMessage = await channel.send({embeds: [MSG]});
        client.queueMessages.add(serverID, queueMessage);
        musicReact(queueMessage);
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}