module.exports = async (message, arguments, client, con, interaction = null) => 
{
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return message.channel.send(stuffs);}}

    try
    {
        if(interaction) reply('[don\'t click it or i will steal your fud](http://azor.eeveebot.com/)');
        else reply('http://azor.eeveebot.com/');
    }
    catch(error){client.bwe.theError(error, message, interaction)}

}