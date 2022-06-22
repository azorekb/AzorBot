const EMOJIS = require('../jsony/emoji.json');

module.exports = async (aMessage, client, con, interaction = null) => 
{
    try
    {
        const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
        if(interaction && interaction.guild == null){interaction.reply('It can\'t be used in DM'); return;}
        const permissions = interaction ? interaction.member.permissions.toArray() : aMessage.message.channel.permissionsFor(aMessage.message.author).toArray();
        let theChannel = interaction ? interaction.options.getChannel('channel') : aMessage.message.mentions.channels.first();
        const serverID = interaction ? interaction.guildId : aMessage.message.guildId;
    
        if(permissions.indexOf('ADMINISTRATOR') == -1)
        {
            reply({content: 'You must be Administrator of the server to use this command ' + EMOJIS.dunno, ephemeral: true});
            return false;
        }
        if(theChannel == undefined){theChannel = 'here'}
        else{theChannel = theChannel.id}
        con.query('select channel from levelup_channel where guild = ' + serverID, (error, result) =>
        {
            if(error == null)
            {
                if(result.length == 0)
                {
                    con.query('insert into levelup_channel (guild, channel) values ("' + serverID + '", "' + theChannel + '")', (error1, _) =>
                    {
                        if(error1 == null)
                        {
                            reply('level up channel set, you can levelup now ' + EMOJIS.sip);
                        }
                        else
                        {
                            reply('Error: ' + error1);
                        }
                    });
                }
                else
                {
                    con.query('update levelup_channel set channel = "' + theChannel + '" where guild = ' + serverID, (error1, _) =>
                    {
                        if(error1 == null)
                        {
                            reply('level up channel set, you can levelup now ' + EMOJIS.sip);
                        }
                        else
                        {
                            reply('Error: ' + error1);
                        }
                    });
                }
            }
            else
            {
                reply('Error: ' + error);
            }
        });
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}