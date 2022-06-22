const EMOJIS = require('../jsony/emoji.json');

module.exports = async (aMessage, client, con, interaction = null) => 
{
    try
    {
        if(interaction && interaction.guild == null){interaction.reply('It can\'t be used in DM'); return;}
        const reply = (stuffs) => {if(interaction){interaction.reply(stuffs);}else{aMessage.message.channel.send(stuffs);}}
        const permissions = interaction ? interaction.member.permissions.toArray() : aMessage.message.channel.permissionsFor(aMessage.message.author).toArray();
        const theArgument = interaction ? interaction.options.getChannel('channel') : aMessage.message.mentions.channels.first();
        const serverID = interaction ? interaction.guildId : aMessage.message.guildId;
    
        if(permissions.indexOf('ADMINISTRATOR') == -1)
        {
            reply('You must be Administrator of the server to use this command ' + EMOJIS.dunno);
            return;
        }
    
        if(theArgument == null)
        {
            con.query('select channel from welcome_goodbye where server = "' + serverID + '"', (err, row) =>
            {
                if(err == null)
                {
                    if(row.length == 0)
                    {
                        reply('There isn\'t set any welcome channel ' + EMOJIS.dunno);
                    }
                    else
                    {
                        reply('Welcome channel is set in <#' + row[0].channel + '> ' + EMOJIS.sip);
                    }
                }
                else
                {
                    reply('Error: ' + err);
                }
            });
            return;
        }
        if(theArgument.type != 'GUILD_TEXT')
        {
            reply('please choose text channel. ' + EMOJIS.sip);
            return;
        }
    
        con.query('select channel from welcome_goodbye where server = "' + serverID + '"', (err, row) =>
        {
            if(err == null)
            {
                if(row.length == 0)
                {
                    con.query('insert into welcome_goodbye (server, channel) values ("' + serverID + '", "' + theArgument.id + '")', (error, nothing) => 
                    {
                        if(error == null)
                        reply('Welcome Channel set ' + EMOJIS.vibbing);
                        else
                        reply('Error: ' + error);
                    });
                }
                else
                {
                    con.query('update welcome_goodbye set channel = "' + theArgument.id + '" where server = "' + serverID + '"', (error, nothing) => 
                    {
                        if(error == null)
                        reply('Welcome Channel set ' + EMOJIS.vibbing);
                        else
                        reply('Error: ' + error);
                    });
                }
            }
            else
            {
                reply('Error: ' + err);
            }
        });    
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}
