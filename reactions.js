const Discord = require('discord.js');
const Canvas = require('canvas');
module.exports = async (reaction, user, client) => 
{
    try
    {
        let ACTION;
        if((ACTION = client.bwe.picReact.find(reaction.message.channel.id, reaction.message.id)) > -1)
        {
            let thePic = client.bwe.picReact.theList[ACTION];
            if(thePic.author == user.id)
            {
                if(reaction.emoji.name == 'bweLeft' || reaction.emoji.name == 'bweRight')
                {
                    let filesArray = [];
                    const directory = thePic.dir;
                    await client.bwe.crawl(directory,filesArray);
                    if(filesArray.length > 1)
                    {
                        let picNum = thePic.picture;
                        if(reaction.emoji.name == 'bweLeft'){picNum--;}
                        if(picNum == -1){picNum = filesArray.length - 1;}
                        if(reaction.emoji.name == 'bweRight'){picNum++;}
                        if(picNum == filesArray.length){picNum = 0;}
                        const text = (picNum + 1) + '/' + filesArray.length;
                        const theEnd = filesArray[picNum].slice(filesArray[picNum].indexOf('.'));
                        const attachment = new Discord.MessageAttachment(filesArray[picNum], 'att' + theEnd);
                        const embed = new Discord.MessageEmbed()
                        .setTitle(thePic.OCname)
                        .setColor(client.bwe.AzorDefaultColor)
                        .setImage('attachment://att' + theEnd)
                        .setFooter({ text: text});
                        await thePic.message.edit({ embeds: [embed] ,files: [attachment]});
                        thePic.picture = picNum;
                        thePic.message.reactions.resolve(reaction).users.remove(user.id);
                    }
                }
                if(reaction.emoji.name == 'bweX')
                {
                    thePic.message.delete();
                    client.bwe.picReact.theList.splice(ACTION, 1);
                }
            }
        }
    
        if((ACTION = client.queueMessages.get(reaction.message.guild.id)) != null && reaction.message.id == ACTION.id)
        {
            const guildQueue = client.player.getQueue(reaction.message.guild.id);
            if(guildQueue == undefined){return false;}
            let shouldIEditMessage = true;
            let botChannel = 0;
            let userChannel = 1;
    
            await reaction.message.guild.members.fetch(user.id).then(member => 
            {
                if(member.voice.channel != null){userChannel = member.voice.channel.id;}
            });
            await reaction.message.guild.members.fetch(client.user.id).then(member => 
            {
                if(member.voice.channel != null){botChannel = member.voice.channel.id;}
            });
            if(botChannel == userChannel)
            {
                await ACTION.reactions.resolve(reaction).users.remove(user.id);
                switch(reaction.emoji.name)
                {
                    case 'bwePausePlay': if(guildQueue.paused){guildQueue.setPaused(false)}else{guildQueue.setPaused(true)} break;
                    case 'bweShuffle': guildQueue.shuffle(); break;
                    case 'bweUp': if(guildQueue.volume >= 200){guildQueue.setVolume(200);}else{guildQueue.setVolume(guildQueue.volume + 10);} break;
                    case 'bweDown': if(guildQueue.volume <= 0){guildQueue.setVolume(0);}else{guildQueue.setVolume(guildQueue.volume - 10);} break;
                    case 'bweSkip': guildQueue.skip(); break;
                    case 'bweLoop1': if(guildQueue.repeatMode == 1){guildQueue.setRepeatMode(0)}else{guildQueue.setRepeatMode(1)} break;
                    case 'bweLoop2': if(guildQueue.repeatMode == 2){guildQueue.setRepeatMode(0)}else{guildQueue.setRepeatMode(2)} break;
                    case 'bweStop': guildQueue.stop(); shouldIEditMessage = false; client.bwe.queueMessagesTimeouts.delete(reaction.message.guild.id); ACTION.channel.send('Music Stop!' + EMOJIS.sit); ACTION.delete(); client.queueMessages.delete(reaction.message.guild.id); break;
    
                    default: shouldIEditMessage = false;
                }
    
                if(shouldIEditMessage)
                {  
                    const MSG = client.bwe.createQueueMessage(reaction.message.guild.id);
                    ACTION.edit({embeds: [MSG]});
                }
            }
        }

        if((ACTION = client.bwe.battle.find(user.id)) > -1)
        {
            let battle = client.bwe.battle.theList[ACTION];
            if(battle.message == reaction.message.id)
            {
                if(reaction.emoji.name == 'bweLoop2')
                {
                    const random1 = (_max = 0) => {return Math.floor(Math.random() * (641 - _max));}
                    const random2 = (_max = 0) => {return Math.floor(Math.random() * (826 - _max));}
                    const timeStart = new Date().getTime();
                    const canvas = Canvas.createCanvas(641, 826);
                    const context = canvas.getContext('2d');
                    const BGIMG = battle.pictures.background;
                    context.drawImage(BGIMG, 0, 0);
                    const stuffs = battle.pictures.stuffs;
                    context.drawImage(stuffs, 0, 0);
                    const PFP = battle.pictures.pfp;
                    context.drawImage(PFP, random1(100), random2(100), 100, 100);
                    context.drawImage(PFP, random1(34), random2(35), 34, 35);
                    
                    context.font = 'bold 15px comic Sans MS';
                    context.fillStyle = '#080';
                    context.fillText('dupa', random1(), random2());
                    context.fillText('The dupa', random1(), random2());
                    
                    for(let i = 0; i< 4; i++)
                    {
                        context.fillText('move ' + i, random1(), random2());
                    }

                    const OPO_IMG = battle.pictures.opo;
                    context.drawImage(OPO_IMG, random1(230), random2(320), 230, 320);
                    
                    const PLACES = [[random1(100),random2(100)], [random1(100),random2(100)],[random1(100),random2(100)],[random1(100),random2(100)],[random1(100),random2(100)]];
                    for(let j = 0; j < 5; j++)
                    {
                        const ALLY_IMG = battle.pictures.ally[j];
                        context.drawImage(ALLY_IMG, PLACES[j][0], PLACES[j][1], 100, 100);
                    }

                    for(let i = 0; i < battle.pictures.status.length; i++)
                    {
                        const IMG_STATUS = battle.pictures.status[i];
                        context.drawImage(IMG_STATUS, random1(30), random2(30), 30, 30);
                    }
                    
                    const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'battle.png');
                    const embed = new Discord.MessageEmbed().setImage('attachment://battle.png');
                    
                    await battle.message.edit({embeds: [embed], files: [attachment], content: '_ _'});
                    
                    const timeEnd = new Date().getTime();
                    const timeDifference = timeEnd - timeStart;
                    await battle.message.edit('time: ' + timeDifference / 1000);
                }
                await battle.message.reactions.resolve(reaction).users.remove(user.id);
                if(reaction.emoji.name == 'bweX')
                {
                    battle.message.delete();
                    client.bwe.battle.delete(user.id);
                }
            }
        }
    }
    catch(error){console.log(error)}

}