module.exports = async (aMessage, client, con, interaction = null) => 
{
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
    try
    {
        reply('there is nothing to test atm');
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}