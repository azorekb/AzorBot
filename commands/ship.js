module.exports = async (message, arguments, client, con, interaction = null) => 
{
    const reply = (stuffs) => {if(interaction){return interaction.channel.send(stuffs);}else{return message.channel.send(stuffs);}}
    try
    {
        reply(':ship:');
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}