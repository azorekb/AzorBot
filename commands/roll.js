const EMOJIS = require('../jsony/emoji.json');
module.exports = async (aMessage, client, con, interaction = null) => 
{
    try
    {
        let theArgument = [];
        theArgument[0] = interaction ? interaction.options.getInteger('max') : aMessage.arguments[0];
        theArgument[1] = interaction ? interaction.options.getInteger('count') : aMessage.arguments[1];
        const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
    
        if(theArgument[0] == undefined)
        {
            reply({content: 'Usage: roll [max number] [number of rolls in same time (optional)]' + EMOJIS.sip, ephemeral: true});
            return false;
        }
        
        if(theArgument[1] == undefined){theArgument[1] = 1;}
        for(let i = 0; i < 2; i++)
        {
            theArgument[i] *= 1;
            if(isNaN(theArgument[i]))
            {
                reply({content: 'arguments must be numbers ' + EMOJIS.hide, ephemeral: true});
                return false;
            }
            if(!Number.isInteger(theArgument[i]))
            {
                reply({content: 'arguments must be integer ' + EMOJIS.hide, ephemeral: true});
                return false;
            }
            if(theArgument[i] < 1)
            {
                reply({content: 'arguments must be more than 0 ' + EMOJIS.hide, ephemeral: true});
                return false;
            }
        }
        const limit = (Math.ceil(Math.log10(arguments[0] + 1)) + 2) * arguments[1];
        if(limit > 2000)
        {
            reply({content: 'limit of text could be exceeded, try less numbers ' + EMOJIS.hide, ephemeral: true});
            return false;
        }
        let text = '' + Math.floor(Math.random() * (theArgument[0] + 1));
        for(let i = 1; i < theArgument[1]; i++)
        {
            text += ', ' + Math.floor(Math.random() * (theArgument[0] + 1));
        }
    
        reply(text);
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}

}