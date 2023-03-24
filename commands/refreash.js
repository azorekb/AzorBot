module.exports = async (message, arguments, client, con, interaction = null) => 
{
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return message.channel.send(stuffs);}}
    const theArgument = interaction ? interaction.options.getString('name') : arguments[0];
    const author = interaction ? interaction.member.id : message.author.id;
    try
    {
        if(author == '303821168245342218')
        {
            delete require.cache[require.resolve('../' + theArgument.toLowerCase())];
            reply('doned');
        }
        else
        {
            reply('um... hehe nu...');
        }
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}