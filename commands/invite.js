module.exports = async (message, arguments, client, con, interaction = null) => 
{
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return message.channel.send(stuffs);}}

    try
    {
        if(interaction) reply('[Join me](https://discord.gg/EGaRxBAfr2)');
        else reply('https://discord.gg/EGaRxBAfr2');
    }
    catch(error){client.bwe.theError(error, message, interaction)}

}
