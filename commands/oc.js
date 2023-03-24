const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const EMOJIS = require('../jsony/emoji.json');

module.exports = async (message, arguments, client, con, interaction = null, FOLDER = 'oc') => 
{
    try
    {
        let characters = [];
        await client.bwe.crawl('./' + FOLDER, characters);
        const theArgument = interaction ? interaction.options.getString('name') : arguments[0];
        const reply = async (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return message.channel.send(stuffs);}}
        const channel = interaction ? interaction.channel : message.channel;
        const author = interaction ? interaction.member.id : message.author.id;
        
        if(theArgument == null || theArgument == 'total')
        {
            let msg = '';
            let sum = 0;
            for(let i = 0; i < characters.length; i++)
            {
                let filesArray = [];
                await client.bwe.crawl(characters[i],filesArray);
                msg += characters[i].slice(FOLDER.length + 1) + ': ' + filesArray.length + ',\n';
                sum += filesArray.length;
            }
            
            const embed = new MessageEmbed()
            .setTitle('List of available ' + FOLDER + 's')
            .setColor(client.bwe.AzorDefaultColor)
            .setDescription(msg + '\n**sum**: ' + sum);
            
            reply({embeds: [embed]});
        }
        else
        {
            if(characters.indexOf(FOLDER + '\\' + theArgument.toLowerCase()) > -1)
            {
                if(theArgument.indexOf('nsfw') > -1 && !channel.nsfw)
                {
                    reply('I can\'t send it here, it\'s nsfw ' + EMOJIS.blush);
                    return false;
                }
                
                let filesArray = [];
                const directory = './' + FOLDER + '/' + theArgument.toLowerCase();
                await client.bwe.crawl(directory,filesArray);
                const RAND = Math.floor(Math.random() * filesArray.length);
                const text = (RAND + 1) + '/' + filesArray.length;
                const theEnd = filesArray[RAND].slice(filesArray[RAND].indexOf('.'));
                const attachment = new Discord.MessageAttachment(filesArray[RAND], 'att' + theEnd);
                
                const embed = new MessageEmbed()
                .setTitle(theArgument)
                .setColor(client.bwe.AzorDefaultColor)
                .setImage('attachment://att' + theEnd)
                .setFooter({ text: text});
                
                const stuffs = {embeds: [embed], files: [attachment]};
                if(interaction)
                {
                    const row = new MessageActionRow().addComponents(
                        new MessageButton().setCustomId('left').setLabel(' ').setStyle('PRIMARY').setEmoji('980031862779027476'),
                        new MessageButton().setCustomId('right').setLabel(' ').setStyle('PRIMARY').setEmoji('980031862858727484'),
                        new MessageButton().setCustomId('delete').setLabel(' ').setStyle('DANGER').setEmoji('979738787070492793'),
                    );
                    stuffs.components = [row];
                    interaction.reply(stuffs);
                }
                else
                {
                    const theMessage = await message.channel.send(stuffs);
                    client.bwe.picReact.add(theMessage, directory, RAND, author, theArgument);
                    if(filesArray.length > 1)
                    {
                        theMessage.react('<a:bweLeft:980031862779027476>');
                        theMessage.react('<a:bweRight:980031862858727484>');
                    }
                    theMessage.react('<a:bweX:979738787070492793>');
                    client.bwe.deleteMessage(message);
                }
    
            }
            else
            {
                reply('You wrote wrong name. ' + EMOJIS.hide);
            }
        }
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}    