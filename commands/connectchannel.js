const EMOJIS = require('../jsony/emoji.json');
module.exports = async (aMessage, client, con, interaction = null) => 
{
    try
    {
        if(interaction && interaction.guild == null){interaction.reply('It can\'t be used in DM'); return;}
        const theArgument = interaction ? interaction.options.getString('code') : aMessage.arguments[0];
        let theChannel = interaction ? interaction.channel : aMessage.message.channel;
        const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
    
        if(theArgument == undefined)
        {
            con.query('select code from connect_channel where channel = "' + theChannel.id + '";', (error, result) => 
            {
                if(error == null) 
                {
                    if(result[0] == undefined)
                    {
                        reply('Your connection code is none ' + EMOJIS.sip);
                    }
                    else
                    {
                        reply('Your connection code is ' + result[0].code + ' ' + EMOJIS.sip);
                    }
                }
                else 
                {
                    reply('error: ' + error);
                }
            });
            
            return false;
        }
        if(theArgument.length > 100)
        {
            reply('Your connection code is too long (max 100) ' + EMOJIS.hide);
            return false;
        }
        con.query('select code from connect_channel where channel = "' + theChannel.id + '";', (error, result) => 
        {
            if(error == null) 
            {
                if(result[0] == undefined)
                {
                    con.query('insert into connect_channel(channel, code) values ("' + theChannel.id + '","' + theArgument + '");', (e) => 
                    {
                        if(e == null){reply('Code set ' + EMOJIS.vibbing)}
                        else{reply('error: ' + e);}
                    });
                }
                else
                {
                    con.query('update connect_channel set code = "' + theArgument + '" where channel = "' + theChannel.id + '";', (e) => 
                    {
                        if(e == null){reply('Code set ' + EMOJIS.vibbing)}
                        else{reply('error: ' + e);}
                    });
                }
            }
            else 
            {
                reply('error: ' + error);
            }
        });
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
    
}