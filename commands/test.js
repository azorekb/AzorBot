const { MessageEmbed } = require('discord.js');
const TEXTS = require('../jsony/texts.json').newCharacter;
module.exports = async (aMessage, client, con, interaction = null) => 
{
    const reply = (stuffs) => {if(interaction){return interaction.channel.send(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
        const member = interaction ? interaction.member : aMessage.message.member;
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

            const embed = new MessageEmbed().setColor(client.bwe.AzorDefaultColor).setTitle(TEXTS.title.english)
            .setAuthor({name: member.displayName, iconURL: member.displayAvatarURL()})
            .setDescription('Step 1: ' + TEXTS.steps[0].english);

            const theMessage = await reply({embeds: [embed]});
            client.bwe.creatingCharacter.add(theMessage, author, theMessage.channel.id);
        }
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}