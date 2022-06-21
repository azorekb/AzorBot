const { MessageEmbed } = require('discord.js');
const emotes = (str) => str.match(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}/gu);
const EMOJIS = require('../jsony/emoji.json');
const math = require('mathjs');

function changeCalculationString(string)
{
    string = string.replace(/:/g, '/');
    string = string.replace(/÷/g, '/');
    string = string.replace(/ęć/g, '5-pi');
    string = string.replace(/π/g, 'pi');
    string = string.replace(/x/g, '*');
    string = string.replace(/√/g, 'sqrt');
    return string;
}
module.exports = async (aMessage, client, con) => 
{
    const arguments = aMessage.arguments;
    const message = aMessage.message;
    let guildQueue = client.player.getQueue(message.guild.id);

    try
    {
        switch(aMessage.command.toLowerCase())
        {
            case 'poll':
                const USAGE = 'right usage:\nbwe!pool #optional-channel-mention\ntopic\n:emoji-1: option 1\n:emoji-2: option 2\n:optional anoter emojis: optional another options.';
                let lines = message.content.split('\n');
                const theChannel = message.mentions.channels.first()? message.mentions.channels.first(): message.channel;
                if(lines.length < 4)
                {
                    message.channel.send(USAGE);
                    return false;
                }

                let theText = '';
                for(let i = 2; i < lines.length; i++)
                {
                    theText += lines[i] + '\n';
                    if(emotes(lines[i]) == null)
                    {
                        message.channel.send(USAGE);
                        return false;
                    }
                    else if(client.emojis.cache.get(emotes(lines[i])[0].slice(-19,-1)) == undefined)
                    {
                        message.channel.send('I can\'t use that emoji...');
                        return false;
                    }
                }

                const embedMSG = new MessageEmbed()
                .setColor(client.AzorDefaultColor)
                .setTitle(lines[1])
                .setDescription(theText);

                const theMessage = await theChannel.send({ embeds: [embedMSG] });

                for(let i = 2; i < lines.length; i++)
                {
                    theMessage.react(emotes(lines[i])[0]);
                }
            break;
            case 'nonsense':
                con.query('select date, now() as now from nonsense where guild = "' + message.guild.id + '"', (err, row) =>
                {
                    if(err == null)
                    {
                        if(row.length == 0)
                        {
                            con.query('insert into nonsense (guild,date) values ("' + message.guild.id + '", now())', (error, _) =>
                            {
                                if(error == null)
                                {
                                    message.channel.send('I start to count the days ' + EMOJIS.vibbing);
                                }
                                else
                                {
                                    message.channel.send('error: ' + error);
                                }
                            });
                        }
                        else
                        {
                            con.query('update nonsense set date = now() where guild = "' + message.guild.id + '"', (error, _) =>
                            {
                                if(error == null)
                                {
                                    const difference = Math.floor((row[0].now - row[0].date) / 86400000);
                                    message.channel.send('And something happend, it was ' + difference + ' days without nonsense ' + EMOJIS.hide);
                                }
                                else
                                {
                                    message.channel.send('error: ' + error);
                                }
                            });
                        }
                    }
                    else
                    {
                        message.channel.send('error: ' + err);
                    }
                });
            break;
            case 'playlist':
                if(arguments[0] == undefined){arguments[0] = '';}
                switch(arguments[0].toLowerCase())
                {
                    case 'create':
                        if(arguments[1] == undefined || arguments[1] == '')
                        {
                            message.channel.send('Please set name of playlist. (use _ instead of spaces) ' + EMOJIS.sip);
                        }
                        else if(arguments[1].length > 50)
                        {
                            message.channel.send('The name of playlist is too long. ' + EMOJIS.hide);
                        }
                        else
                        {
                            con.query('select owner from playlists where name = "' + arguments[1] + '"', (err, row) =>
                            {
                                if(err == null)
                                {
                                    if(row.length == 0)
                                    {
                                        con.query('insert into playlists (name, owner) values ("' + arguments[1] + '", "' + message.author.id + '")', (err, row) =>
                                        {
                                            if(err == null)
                                            {
                                                message.channel.send('Playlist added. ' + EMOJIS.sit);
                                            }
                                            else
                                            {
                                                message.channel.send('error:  ' + err);
                                            }
                                        });
                                    }
                                    else
                                    {
                                        message.channel.send('I\'m sorry, there is playlist with that name. ' + EMOJIS.dunno);
                                    }
                                }
                                else
                                {
                                    message.channel.send('error:  ' + err);
                                }
                            });
                        }
    
                    break;                    
                    case 'add':
                        if(message.member.voice.channel == null)
                        {
                            message.channel.send('You must be in the Voice Channel first. ' + EMOJIS.dunno);
                            return false;
                        }
                        text = '';
                        for(let i = 2; i < arguments.length; i++)
                        {
                            text += arguments[i] + ' ';
                        }
                        text = text.trim();
                        
                        if(arguments[2] == undefined)
                        {
                            message.channel.send('usage: playlist add [playlist_name] [url / name of song] ' + EMOJIS.sit);
                        }
                        else
                        {
                            con.query('select owner from playlists where name = "' + arguments[1] + '"', async (err,row) =>
                            {
                                if(err == null)
                                {
                                    if(row.length == 0)
                                    {
                                        message.channel.send('I couldn\'t find that playlist. ' + EMOJIS.hide);
                                    }
                                    else
                                    {
                                        if(row[0].owner == message.author.id)
                                        {
                                            client.bwe.deleteMessage(message);
                                            const messageToEdit = await message.channel.send('Looking for song... ' + EMOJIS.lagging);
                                            let queue = client.player.createQueue(message.guild.id);
                                            await queue.join(message.member.voice.channel);
                                            let song = await queue.play(text).catch(_ => 
                                                {
                                                    if(!guildQueue){queue.stop();}
                                                });
                                                if(song == undefined)
                                                {
                                                    messageToEdit.edit('Sorry, i couldn\'t find this song... ' + EMOJIS.hide);
                                                    setTimeout(() => messageToEdit.delete(), 2500);
                                                }
                                                else
                                                {
                                                    let finalName = song.name;
                                                    while(finalName.indexOf('"') > -1)
                                                    {
                                                        finalName = finalName.replace('"',"'");
                                                    }
                                                    con.query('insert into songs (playlist, url, name) values ("' + arguments[1] + '", "' + song.url + '", "' + finalName + '")', async (err, row) =>
                                                    {
                                                        if(err == null)
                                                        {
                                                            messageToEdit.edit('Song "' + song.name + '" added to playlist. ' + EMOJIS.sit);
                                                            setTimeout(() => messageToEdit.delete(), 2500);

                                                            let queueMessage = client.queueMessages.get(message.guild.id);
                                                            const MSG = client.bwe.createQueueMessage(message.guild.id);
                                                            if(queueMessage == null)
                                                            {
                                                                queueMessage = await message.channel.send({embeds: [MSG], text: ''});
                                                                client.queueMessages.add(message.guild.id, queueMessage);
                                                                musicReact(queueMessage);
                                                            }
                                                            else{queueMessage.edit({embeds: [MSG], text: ''});}
                                                        }
                                                        else
                                                        {
                                                            messageToEdit.edit("error :" + err);
                                                        }
                                                    });
                                                }
                                            }
                                            else
                                            {
                                                message.channel.send('Only creator of the playlist can edit it. ' + EMOJIS.hide);
                                            }
                                        }
                                    }
                                    else
                                    {
                                        message.channel.send('Error: ' + err);
                                    }
                                });
                            }
                    break;
                    case 'play': 
                        if(message.member.voice.channel == null)
                        {
                            message.channel.send('You must be in the Voice Channel first. ' + EMOJIS.dunno);
                            return false;
                        }
                        if(arguments[1] == undefined)
                        {
                            message.channel.send('tell me what playlist i can play for you. ' + EMOJIS.sip);
                        }
                        else
                        {
                            let query = 'select url from songs where playlist = "' + arguments[1] + '"';
                            if(arguments[1] == 'it' && arguments[2] == 'all')
                                query = 'select url from songs inner join playlists on playlist = playlists.name where owner = "' + message.author.id + '"';
                            con.query(query, async (err, rows) =>
                            {
                                if(err == null)
                                {
                                    if(rows.length == 0)
                                    {
                                        message.channel.send('The playlist is empty or doesn\'t exist. ' + EMOJIS.hide);
                                    }
                                    else
                                    {
                                        client.bwe.deleteMessage(message);
                                        let azorro = await message.channel.send(EMOJIS.lagging);
                                        for(let i = 0; i < rows.length; i++)
                                        {
                                            let queue = client.player.createQueue(message.guild.id);
                                            await queue.join(message.member.voice.channel);
                                            let song = await queue.play(rows[i].url).catch(_ => {if(!guildQueue){queue.stop();}});
                                            if(song == undefined)
                                            {
                                                message.channel.send('something went wrong with one song ' + EMOJIS.hide); 
                                            }
                                        }

                                        const MSG = client.bwe.createQueueMessage(message.guild.id);
                                        const theQueueMessage = client.queueMessages.get(message.guild.id);
                                        if(theQueueMessage == null)
                                        {
                                            azorro.edit({embeds: [MSG], text: ''});
                                            client.queueMessages.add(message.guild.id, azorro);
                                            musicReact(azorro);
                                        }
                                        else
                                        {
                                            theQueueMessage.edit({embeds: [MSG], text: ''});
                                            client.queueMessages.add(message.guild.id, theQueueMessage);
                                            azorro.edit('Playlist loaded!' + EMOJIS.vibbing);
                                            setTimeout(() => {azorro.delete()}, 5000);
                                        }
                                        
                                    }
                                }
                                else
                                {
                                    message.channel.send('Error: ' + err);
                                }
                            });
                        }
                    break;
                    case 'delete':
                        switch(arguments[1])
                        {
                            case 'song': 
                            if(arguments[3] == undefined)
                            {
                                message.channel.send('usage: playlist delete song [playlist_name] [number_of_song]');
                            }
                            else
                            {
                                con.query('select owner from playlists where name = "' + arguments[2] + '"', (err, rows) =>
                                {
                                    if(err == null)
                                    {
                                        if(rows.length == 0)
                                        {
                                            message.channel.send('There is no Playlist with the name. ' + EMOJIS.hide);
                                        }
                                        else if(rows[0].owner == message.author.id)
                                        {
                                            if(isNaN(arguments[3] * 1)){message.channel.send('Number of song must be... hmm... a number ' + EMOJIS.dunno);}
                                            con.query('select id from songs where playlist = "' + arguments[2] + '"', (error, rows_2) =>
                                            {
                                                if(error == null)
                                                {
                                                    if(arguments[3] * 1 < 1 || arguments[3] * 1 > rows_2.length)
                                                    {
                                                        message.channel.send('There is no song with that number ' + EMOJIS.hide);
                                                    }
                                                    else
                                                    {
                                                        con.query('delete from songs where id = ' + rows_2[arguments[3] - 1].id, (errors) => 
                                                        {
                                                            if(errors == null)
                                                            {
                                                                message.channel.send('Song deleted from playlist. ' + EMOJIS.sit);
                                                            }
                                                            else
                                                            {
                                                                message.channel.send('Error: ' + errors);
                                                            }
                                                        });
                                                    }
                                                }
                                                else
                                                {
                                                    message.channel.send('Error: ' + error);
                                                }
                                            });
                                        }
                                        else
                                        {
                                            message.channel.send('Only creator of the Playlist can edit it. ' + EMOJIS.dunno);
                                        }
                                    }
                                    else
                                    {
                                        message.channel.send('Error: ' + err);
                                    }
                                });
                            }
                        break;
                            case 'playlist':
                                if(arguments[2] == undefined)
                                {
                                    message.channel.send('usage: playlist delete playlist [playlist_name]');
                                }
                                else
                                {
                                    con.query('select owner from playlists where name = "' + arguments[2] + '"', (err, rows) =>
                                    {
                                        if(err == null)
                                        {
                                            if(rows.length == 0)
                                            {
                                                message.channel.send('There is no Playlist with the name. ' + EMOJIS.hide);
                                            }
                                            else if(rows[0].owner == message.author.id)
                                            {
                                                if(arguments[3] == 'sure')
                                                {                                                    
                                                    con.query('delete from songs where playlist = "' + arguments[2] + '"', (errors) => 
                                                    {
                                                        if(errors == null)
                                                        {
                                                            con.query('delete from playlists where name = "' + arguments[2] + '"', (someErrors) =>{
                                                                if(someErrors == null)
                                                                {
                                                                    message.channel.send('Playlist deleted. ' + EMOJIS.sit);
                                                                }
                                                                else
                                                                {
                                                                    message.channel.send('Error: ' + someErrors);
                                                                    
                                                                }
                                                            });
                                                        }
                                                        else
                                                        {
                                                            message.channel.send('Error: ' + errors);
                                                        }
                                                    });
                                                }
                                                else{message.channel.send('You\'re sure you want to delete whole playlist? (write \'sure\' as another argument) ' + EMOJIS.hide);}
                                            }
                                            else
                                            {
                                                message.channel.send('Only creator of the Playlist can edit it. ' + EMOJIS.dunno);
                                            }
                                        }
                                        else
                                        {
                                            message.channel.send('Error: ' + err);
                                        }
                                    });
                                }
                            break;
                            
                            default: message.channel.send('I can delete **song** or **playlist** ' + EMOJIS.sip);
                        }
                    break;                
                    case 'show':
                        if(arguments[1] == undefined)
                        {
                            con.query('select name from playlists', (err, row) =>
                            {
                                if(err == null)
                                {
                                    text = 'List of Playlists:';
                                    for(let i = 0; i < row.length; i++)
                                    {
                                        text += '\n' + (i + 1) + '. ' + row[i].name;
                                    }
                                    message.channel.send(text);
                                }
                                else
                                {
                                    message.channel.send('Error: ' + err);
                                }
                            });
                        }
                        else
                        {
                            con.query('select name from songs where playlist = "' + arguments[1] + '"', (err, row) =>
                            {
                                if(err == null)
                                {
                                    text = 'List of songs:'
                                    for(let i = 0; i < row.length; i++)
                                    {
                                        text += '\n' + (i + 1) + '. ' + row[i].name;
                                    }
                                    if(row.length == 0)
                                    {
                                        message.channel.send('The playlist is empty or doesn\'t exist. ' + EMOJIS.hide);
                                    }
                                    else
                                    {
                                        message.channel.send(text);
                                    }
                                }
                                else
                                {
                                    message.channel.send(err);
                                }
                            });
                        }
                    break;
                }
                                    
            break; 
            case 'count': case 'calculate':
            try
            {
                let text = '';
                if(arguments[0] == undefined){message.channel.send('tell me what to calculate. ' + EMOJIS.sip); return false;}
                for(let i = 0; i < arguments.length; i++){text += arguments[i];}


                text = changeCalculationString(text);
                if(text == '2+2*2'){message.channel.send('8 ' + EMOJIS.run + ' ||jk 6||'); return false;}
                if(text == '9+10'){message.channel.send('21 ' + EMOJIS.think + ' ||jk 19||'); return false;}
                if(text == '0/0'){message.channel.send('<a:AzorExplode:982055237378519081>'); return false;}

                if(text.indexOf('±') > -1 || text.indexOf('∓') > -1)
                {
                    let texts = [text,text];
                    texts[0] = texts[0].replace(/±/g, '+');
                    texts[0] = texts[0].replace(/∓/g, '-');
                    texts[1] = texts[1].replace(/±/g, '-');
                    texts[1] = texts[1].replace(/∓/g, '+');
                    text = '';
                    for(let i = 0; i < 2; i++)
                    {
                        text += (i + 1) + ': ';
                        const node = math.parse(texts[i]);
                        const calculation = math.evaluate(node.toString());
                        if(calculation == Infinity){text += '<a:FA_Sparkles:977507221166518322> **INFINITY** <a:FA_Sparkles:977507221166518322>';}
                        else{text += calculation.toString();}
                        text += '\n';
                    }
                    message.channel.send(text);
                    return false;
                }

                const node = math.parse(text);
                const calculation = math.evaluate(node.toString());
                if(calculation == Infinity){message.channel.send('<a:FA_Sparkles:977507221166518322> **INFINITY** <a:FA_Sparkles:977507221166518322>'); return false;}
                message.channel.send(calculation.toString());
                
            }
            catch(e)
            {
                console.log(e);
                message.channel.send('Something isn\'t right ' + EMOJIS.hide);
            }
            break;
                       
            default: return true;
        }
    
        return false;
    }
    catch(error)
    {
        message.channel.send('Some error happened. ' + EMOJIS.blush);
        client.channels.cache.get('946830760839610460').send('error: ' + error);
        console.log(error);  
    }
}