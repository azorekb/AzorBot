module.exports = async (aMessage, client, con, interaction = null) => 
{
    DEX = client.bwe.loadJson('pokedex').pokemon;
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return aMessage.message.channel.send(stuffs);}}

    let count = 0;
    for(let i = 0; i < DEX.length; i++){if(DEX[i]){count++;}}
    reply('Number pokemon in Pokedex: ' + count + '/' + DEX.length);
}