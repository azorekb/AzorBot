module.exports = async (message, arguments, client, con, interaction = null) =>
{
    const author = interaction ? interaction.member.id : message.author.id;
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return message.channel.send(stuffs);}}

    try
    {
        con.query('select name from names where ID = "' + author + '";', (error, row) =>
        {
            if(error) return reply(' ' + error);
            if(row.length) reply('Goodmorning ' + row[0].name);
            else reply('Goodmorning ' + message.member.displayName);
        });
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}