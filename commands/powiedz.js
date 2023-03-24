const ChannlesList = require('./jsony/channels.json');
module.exports = async (message, arguments, client, con) => //no slash
{
    try
    {
        if(arguments[1] != undefined)
        {
            text = arguments[1];
            for(let i = 2; i < arguments.length; i++)
            {
                text += ' ' + arguments[i];
            }
            if(message.mentions.channels.first())
            {
                message.mentions.channels.first().send(text);
                client.bwe.deleteMessage(message);
            }
            else if(arguments[0] == 'here')
            {
                message.channel.send(text);
                client.bwe.deleteMessage(message);
            }
            else if(ChannlesList[arguments[0]] == undefined)
            {
                message.channel.send('i don\'t know this channel');
            }
            else
            {
                client.channels.cache.get(ChannlesList[arguments[0]]).send(text);
                client.bwe.deleteMessage(message);
            }
            
        }
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}