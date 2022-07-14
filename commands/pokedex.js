const { number } = require("mathjs");

module.exports = async (aMessage, client, con, interaction = null) => 
{
    DEX = client.bwe.loadJson('pokedex').pokemon;
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
    const theArgument = interaction ? interaction.options.getString('nameornumber') : aMessage.arguments[0];

    try
    {
        if(theArgument == null)
        {
            let count = 0;
            for(let i = 0; i < DEX.length; i++){if(DEX[i]){count++;}}
            reply('Number pokemon in Pokedex: ' + count + '/' + DEX.length + '\nwrite name of pokemon or number in pokedex to see more details');
            return
        }
        let pokemon = theArgument * 1 - 1;
        if(isNaN(pokemon)){for(let i = 0; i < DEX.length; i++){if(DEX[i]?.name.toLowerCase() == theArgument.toLowerCase()){pokemon = i;}}}
        if(isNaN(pokemon) || !DEX[pokemon])
        {
            reply('I don\'t have any info about that pokemon.');
            return
        }
        reply('Pokemon: ' + DEX[pokemon].name + '\nnumber: ' + (pokemon + 1) + '\nMocha: yeshanium Z\nAzor: bweeeeeeeee');
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}