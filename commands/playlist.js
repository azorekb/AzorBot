module.exports = async (message, arguments, client, con, interaction = null) =>
{
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return message.channel.send(stuffs);}}

    try
    {
        reply('this command doesn\'t work...')
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}