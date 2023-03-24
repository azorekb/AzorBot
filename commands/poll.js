const { MessageEmbed } = require('discord.js');
const emotes = (str) => str.match(/<a?:.+?:\d{18}>|<a?:.+?:\d{19}>|\p{Extended_Pictographic}/gu);
module.exports = async (message, arguments, client, con, interaction = null) => 
{
    try
    {
        const USAGE = 'right usage:\nbwe!pool #optional-channel-mention\ntopic\n:emoji-1: option 1\n:emoji-2: option 2\n:optional anoter emojis: optional another options.';
        let lines = message.content.split('\n');
        const theChannel = message.mentions.channels.first()? message.mentions.channels.first(): message.channel;
        if(lines.length < 4)
        {
            message.channel.send(USAGE);
            return false;
        }
        
        let theText = '';
        for(let i = 2; i < lines.length; i++)
        {
            theText += lines[i] + '\n';
            let theEmoji = emotes(lines[i]);
            if(theEmoji == null)
            {
                message.channel.send(USAGE);
                return false;
            }
            else if(client.emojis.cache.get(theEmoji[0].slice(theEmoji[0].indexOf(':', 3) + 1,-1)) == undefined)
            {
                message.channel.send('I can\'t use that emoji...');
                return false;
            }
        }
        
        const embedMSG = new MessageEmbed()
        .setColor(client.AzorDefaultColor)
        .setTitle(lines[1])
        .setDescription(theText);
        
        const theMessage = await theChannel.send({ embeds: [embedMSG] });
        
        for(let i = 2; i < lines.length; i++)
        {
            theMessage.react(emotes(lines[i])[0]);
        }
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}