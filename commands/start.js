const { MessageEmbed } = require('discord.js');
module.exports = async (message, arguments, client, con, interaction = null) => 
{
    const TEXTS = client.bwe.loadJson('texts').newCharacter;
    const reply = (stuffs) => {if(interaction){return interaction.channel.send(stuffs);}else{return message.channel.send(stuffs);}}
    const member = interaction ? interaction.member : message.member;
    const author = interaction ? interaction.member.id : message.author.id;
    
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
    catch(error){client.bwe.theError(error, message, interaction)}
}