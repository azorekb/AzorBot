module.exports = async (aMessage, client, con, interaction = null) => 
{
    try
    {
        // if(interaction && interaction.guild == null){interaction.reply('It can\'t be used in DM'); return;}
        const reply = (stuffs) => {if(interaction){interaction.reply(stuffs);}else{aMessage.message.reply(stuffs);}}
        
        reply({content: 'Test', ephemeral: true});
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}