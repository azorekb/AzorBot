module.exports = async (aMessage, client, con, interaction = null) => 
{
    const reply = (stuffs) => {if(interaction){return interaction.channel.send(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
    try
    {
        reply(':ship:');
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}