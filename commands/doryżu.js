const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

module.exports = async (message, arguments, client, con, interaction = null) => 
{
    const reply = (stuffs) => {if(interaction){return interaction.channel.send(stuffs);}else{return message.channel.send(stuffs);}}

    try
    {
        const member = message.mentions.users.first();
        const canvas = Canvas.createCanvas(255, 255);
        const context = canvas.getContext('2d');
        const ryz1 = await Canvas.loadImage('./img/ryz.jpg');
        context.drawImage(ryz1, 0, 0, canvas.width, canvas.height);
        const avatar = await Canvas.loadImage(member.displayAvatarURL({ format: 'png' }));
        context.drawImage(avatar, 70, 60, 100, 100);
        // const ryz2 = await Canvas.loadImage('./img/ryz.gif');
        // context.drawImage(ryz2, 0, 122, 255, 133);
        const attachment = new MessageAttachment(canvas.toBuffer(), 'ryz.png');
        reply({ files: [attachment] });
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}