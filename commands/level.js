const EMOJIS = require('../jsony/emoji.json');
const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');

module.exports = async (message, arguments, client, con, interaction = null) => 
{
    try
    {
        if(interaction && interaction.guild == null){interaction.reply('It can\'t be used in DM'); return;}
        const author = interaction ? interaction.member.id : message.author.id;
        const serverID = interaction ? interaction.guildId : message.guildId;
        const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return message.channel.send(stuffs);}}
        const member = interaction ? interaction.member : message.member;
    
        con.query('select exp,level from levelup_people where member = "' + author + '" and guild = "' + serverID + '"', async (error, result) =>
        {
            if(error == null)
            {
                if(result.length == 0)
                {
                    reply('leveling isn\'t active on this server or something went wrong ' + EMOJIS.hide);
                    return false;
                }
                con.query('select name from names where ID = "' + author + '";', async (err, yesh) =>
                {
                    if(err) return reply(' ' + err);
                    const canvas = Canvas.createCanvas(1600, 826);
                    const context = canvas.getContext('2d');
                    const background = await Canvas.loadImage('./img/background.png');
                    context.drawImage(background, 0, 0, canvas.width, canvas.height);
                    context.font = '100px comic Sans MS';
                    context.fillStyle = '#000000';
                    context.fillText('Level ' + result[0].level, 610, 260);
                    context.fillStyle = '#9E373E';
                    context.fillText('Level ' + result[0].level, 605, 255);
                    context.font = '70px comic Sans MS';
                    context.fillStyle = '#000000';
                    const theName = yesh.length ? yesh[0].name : member.displayName;
                    context.fillText(theName, 710, 420);
                    context.fillStyle = '#9E373E';
                    context.fillText(theName, 705, 415);
                    const NEXT_LEVEL = result[0].level * 15 + 10;
                    const levelProgress = result[0].exp / NEXT_LEVEL * 1115;
                    context.fillStyle = '#9E373E';
                    context.beginPath();
                    context.moveTo(413, 615);
                    context.lineTo(413 + levelProgress, 615);
                    context.lineTo(362 + levelProgress, 727);
                    context.lineTo(362, 727);
                    context.closePath();
                    context.fill();
                    context.textAlign = "right";
                    context.fillStyle = '#000000';
                    context.fillText(result[0].exp + '/' + NEXT_LEVEL, 1455, 697);
                    context.fillStyle = '#FFCD3D';
                    context.fillText(result[0].exp + '/' + NEXT_LEVEL, 1450, 692);
                    context.beginPath();
                    context.arc(318, 323, 178, 0, Math.PI * 2, true);
                    context.closePath();
                    context.clip();
                    const avatar = await Canvas.loadImage(member.displayAvatarURL({ format: 'png' }));
                    context.drawImage(avatar, 140, 145, 356, 356);
                    const attachment = new MessageAttachment(canvas.toBuffer(), 'level-image.png');

                    reply({ files: [attachment] });
                });
            }
            else
            {
                reply('error: ' + error);
            }
        });
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}