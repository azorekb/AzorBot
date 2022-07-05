module.exports = async (aMessage, client, con, interaction = null) => 
{
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
    const theArgument = interaction ? interaction.options.getString('name') : aMessage.arguments[0];
    const author = interaction ? interaction.member.id : aMessage.message.author.id;
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
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}