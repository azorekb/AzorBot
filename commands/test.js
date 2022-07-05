module.exports = async (aMessage, client, con, interaction = null) => 
{
    const reply = (stuffs) => {if(interaction){return interaction.channel.send(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
    const author = interaction ? interaction.member.id : aMessage.message.author.id;
    try
    {
        let index = client.bwe.creatingCharacter.find(author);
        if(index == -1)
        {
            if(interaction)
            {
                interaction.deferReply();
                interaction.deleteReply();
            }

            const theMessage = await reply('Please choose your specie. Write name of pokemon or number in pokedex.');
            client.bwe.creatingCharacter.add(theMessage, author, theMessage.channel.id);
        }
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}