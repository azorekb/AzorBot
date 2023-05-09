module.exports = async (message, arguments, client, con, interaction = null) => 
{
    const theArgument = interaction ? interaction.options.getString('name') : arguments.join(' ');
    const EMOJIS = client.bwe.loadJson('emoji');
    const author = interaction ? interaction.member.id : message.author.id;
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return message.channel.send(stuffs);}}

    try
    {
        con.query('select name from names where ID = "' + author + '";', (error, row) =>
        {
            if(error) return reply(' ' + error);
            if(!theArgument) 
            {
                if(row.length == 0) return reply('you don\'t have set custom name.');
                return reply('You set name as: ' + row[0].name);
            }
            if(theArgument.length > 50) return reply('Your name is too long. Please set name with max 50 characters.');

            if(row.length)
                con.query('update names set name = "' + theArgument +'" where ID = "' + author + '";', (e,_) =>
                {
                    if(e) return reply(' ' + e);
                    reply('Your name is succesfully set.');
                });
            else
                con.query('insert into names(ID,name) value ("' + author +'","' + theArgument +'");', (e,_) =>
                {
                    if(e) return reply(' ' + e);
                    reply('Your name is succesfully set.');
                });
        });
    }
    catch(error){client.bwe.theError(error, message, interaction)}

}