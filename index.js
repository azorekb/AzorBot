// -------------------------------- consts --------------------------------
const AzorActivity = 'bweeing';
const Discord = require('discord.js');
const client = new Discord.Client({intents: 32767, partials: ['CHANNEL'], allowedMentions: {parse: ['users']}, repliedUser: true});
const { MessageEmbed } = require('discord.js');
const DATA = require('./data.json');
const mysql = require('mysql');
const EMOJIS = require('./jsony/emoji.json');
const ITHINK = require('./jsony/ithink.json').thinks;

class QueueMessages
{
    messages = [];
    get(guild, index = false)
    {
        for(let i = 0; i < this.messages.length; i++)
        {
            if(this.messages[i].guild.id == guild){return index ? i : this.messages[i];}
        }
        return index ? -1 : null;
    }
    add(guild, message)
    {
        let index = this.get(guild, true);
        if(index == -1){this.messages[this.messages.length] = message;}
        this.messages[index] = message;
    }
    delete(guild)
    {
        this.messages.splice(this.get(guild,true), 1);
    }

}

client.queueMessages = new QueueMessages();

const { Player } = require('discord-music-player');
client.player = new Player(client, {leaveOnEmpty: false,});


client.bwe = require('./bweClass')();

const NAMES = require('./jsony/names.json');
function tellName(_message)
{
    
    let id = _message.author.id;
    for(let i = 0; i < NAMES.names.length; i++)
    {
        if(NAMES.names[i].id == id){return NAMES.names[i].name}
    }

    return _message.member.displayName;
}


// -------------------------------- variable ------------------------------
let con = mysql.createConnection({host:'localhost', user: 'root', password: '', database: 'azorbot'});

// -------------------------------- client on -------------------------------------------
client.on('ready', () => 
{
    console.log('It\'s working');

    client.user.setStatus('online');
    client.user.setActivity({name: AzorActivity, type: 2});
});

client.on('error', (err) =>
{
    console.log(err);
    client.channels.cache.get('935231005369970738').send(err);
});

client.on('messageCreate', async (message) => 
{
    try
    {
        // if(message.author.bot && message.author.id != '951074944660410400'){return false;}
        if(message.author.bot){return false;}
        if(message.guild == null){return false;}
        

        const permissions = message.channel.permissionsFor(message.guild.me)?.toArray();
        if(permissions?.indexOf('SEND_MESSAGES') == -1){return}

        {
            const run = require('./stuffs');
            run(message, client, con);
            delete require.cache[require.resolve('./stuffs')];
        }

        let pinged = false;
        message.mentions.users.forEach(user => 
        {
            if(user.id == '934774688419282984')
            {
                pinged = true;
            }
        });
        message.mentions.roles.forEach(role => 
        {
            if(message.guild.me.roles.cache.get(role.id))
            {
                pinged = true;
            }
        });

        let itsNotMe = true;
        const MESSAGE = message.content.split(' ');
        let command = '', arguments = [];

        if(message.content.toLowerCase().startsWith(DATA.prefix))
        {
            command = MESSAGE[0].slice(DATA.prefix.length);
            for(let i = 1; i < MESSAGE.length; i++)
            {
                arguments[i - 1] = MESSAGE[i];
            }
            itsNotMe = false;
        }
        if(message.content.startsWith(DATA.mention) || message.content.startsWith(DATA.mention2))
        {
            command = MESSAGE[1];
            for(let i = 2; i < MESSAGE.length; i++)
            {
                arguments[i - 2] = MESSAGE[i];
            }
            itsNotMe = false;
        }
        
        if(itsNotMe && pinged)
        {
            switch(MESSAGE[0].toLowerCase())
            {
                case 'hi': command = 'hi'; itsNotMe = false; break;
                case 'hello': command = 'hello'; itsNotMe = false; break;
                case 'hewwo': command = 'hewwo'; itsNotMe = false; break;
                case 'goodmorning': command = 'goodmorning'; itsNotMe = false; break;
                case 'goodnight': command = 'goodnight'; itsNotMe = false; break;

                default: message.channel.send('Did someone ping me? ' + EMOJIS.think);
            }
        }
        
        if(itsNotMe) return false;
        
        if(command == null || command == undefined){command = '';}
        if(command.indexOf('\n') >= 0){command = command.slice(0, command.indexOf('\n'))}

        client.channels.cache.get('935231005369970738').send(message.content + '\n' + message.url);

        let text = '';

        try
        {
            const run = require('./commands/' + command.toLowerCase());
            run(message, arguments, client, con);
            delete require.cache[require.resolve('./commands/' + command.toLowerCase())];

            return;
        }
        catch(e)
        {
            const error = '' + e;
            if(error.indexOf('Error: Cannot find module') == -1)
                console.log(e);
        }

        switch(command.toLowerCase())
        {
            
            
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
                const guildQueue = client.player.guildQueue;
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
                                                            if(queueMessage == null)
                                                            {
                                                                const run = require('./commands/queue');
                                                                run(message, arguments, client, con);
                                                                delete require.cache[require.resolve('./commands/queue')];
                                                            }
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

                                        const theQueueMessage = client.queueMessages.get(message.guild.id);
                                        if(theQueueMessage == null)
                                        {
                                            const run = require('./commands/queue');
                                            run(message, arguments, client, con);
                                            delete require.cache[require.resolve('./commands/queue')];
                                        }
                                        azorro.edit('Playlist loaded!' + EMOJIS.vibbing);
                                        setTimeout(() => {azorro.delete()}, 5000);
                                        
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


            
            case 'goodmornig': message.channel.send('Goodmorning ' + tellName(message)); break;
            case 'goodnight': message.channel.send('Goodnight ' + tellName(message)); break;
            case 'apple': message.channel.send(':apple:'); break;
            case 'orange': message.channel.send('<a:annoyingOrange:939130262942547979>'); break;
            case 'strawberry': message.channel.send(':strawberry:'); break;
            case 'tangerine': message.channel.send(':tangerine:'); break;
            case 'banana': message.channel.send(':banana:'); break;
            case 'watermelon': message.channel.send(':watermelon:'); break;
            case 'blueberries': message.channel.send(':blueberries:'); break;
            case 'melon': message.channel.send(':melon:'); break;
            case 'cherries': message.channel.send(':cherries:'); break;
            case 'peach': message.channel.send(':peach:'); break;
            case 'wakeuperic':
                if(client.bwe.isItAdmin(message))
                {
                    client.users.cache.get('490576799164530717').send('wake up mousie~');
                }
                else
                {
                    message.channel.send('<@!490576799164530717> wake up mousie~');
                }
            break;
            case 'wakeupszibi':
                if(client.bwe.isItAdmin(message))
                {
                    client.users.cache.get('303821168245342218').send('wake up pixie~');
                }
                else
                {
                    message.channel.send('<@!303821168245342218> wake up pixie~');
                }
            break;
            case 'amiadmin':
                if(client.bwe.isItAdmin(message)){message.channel.send('Yes');}
                else{message.channel.send('No')}
            break;
            // case 'commission':
            //     if(message.guild.members.cache.get('951074944660410400'))
            //     {
            //         message.channel.send('Maybe you should ask <@!951074944660410400>?');
            //         let msg = "";
            //         for(let i = 0; i < arguments.length; i++){msg += ' ' + arguments[i];}
            //         message.channel.send('sylv!pictures' + msg);
            //         break;
            //     }
            case 'do': case 'don\'t': case 'what': case 'you': case 'shut': case 'prepare': case 'how': case 'be':
                let isThatAll = true;
                let ask = command.toLowerCase();
                for(let i = 0; i < arguments.length; i++)
                {
                    ask += ' ' + arguments[i].toLowerCase();
                }
                while(ask[ask.length - 1] == '!' || ask[ask.length - 1] == '?' || ask[ask.length - 1] == ' ' || ask[ask.length - 1] == '.')
                {
                    ask = ask.slice(0,-1);
                }
                
                switch(ask)
                {
                    case 'don\'t spam': message.channel.send('I\'m sorry, i will try to be good bwe'); break;
                    case 'don\'t sleep': message.channel.send('me nu sleep...'); break;
                    case 'what a dog': case 'what a doggo': message.channel.send('Woof, woof!'); break;
                    case 'what you can do': case 'what can you do': case 'what do you can': message.channel.send('I can serve you with all my power.'); break;
                    case 'you a dog': case 'you a doggo': case 'you dog': case 'you you doggo': case 'you are dog': case 'you are doggo': case 'you are a dog': case 'you are a doggo': message.channel.send('Woof, woof!'); break;
                    case 'shut up': case 'shut the fuck up': case 'shut the f up':case 'shut the f*ck up': message.channel.send('<:breSad:936268509200142416>'); break;
                    case 'prepare for trouble': message.channel.send('And make it double ' + EMOJIS.vibbing); break;
                    // case 'do you like <@951074944660410400>': case 'do you like stewwabot <@!951074944660410400>': case 'do you like stewwabot': message.channel.send(EMOJIS.blush); break;
                    case 'how dare you': message.channel.send('I\'m sorry, i-i just do my job ' + EMOJIS.please); break;
                    case 'be ready': message.channel.send('I\'m ready waiting for orders ' + EMOJIS.sit); break;
                    case 'what you think': message.channel.send(ITHINK[Math.floor(Math.random() * ITHINK.length)]); break;
                    default: isThatAll = false;
                }
                // <@!951074944660410400>
            if(isThatAll){break;}

            default: message.channel.send('use ' + DATA.prefix + 'help or ' + DATA.mention + ' help or /help to check the command list');
        }
    }
    catch(error)
    {
        message.channel.send('Some error happened. ' + EMOJIS.blush);
        client.channels.cache.get('946830760839610460').send('error: ' + error);
        console.log(error);   
    }
});

client.on('messageReactionAdd', async (reaction, user) =>
{
    if(user.bot){return false;}
    const run = require('./reactions');
    run(reaction, user, client);
    delete require.cache[require.resolve('./reactions')]; 
});

client.on('messageDelete', (message) => 
{
    if((ACTION = client.queueMessages.get(message.guild.id)) != null && message.id == ACTION.id){client.queueMessages.delete(message.guild.id);}
});

client.on('guildMemberAdd', member => 
{
    try
    {
        con.query('select channel from welcome_goodbye where server = "' + member.guild.id + '"', (err, row) => 
        {
            if(err == null)
            {
                if(row.length > 0)
                {
                    let permissions = client.channels.cache.get(row[0].channel).permissionsFor(member.guild.me).toArray();
                    if(permissions.indexOf('SEND_MESSAGES') == -1){return}
                    const embed = new MessageEmbed()
                        .setColor('#00ff00')
                        .setTitle('Welcome to the Server')
                        .setAuthor({name: member.displayName, iconURL: member.displayAvatarURL()})
                        .setDescription(member.displayName + ' just joined us! ' + EMOJIS.vibbing);
                    
                    
                    client.channels.cache.get(row[0].channel).send({ embeds: [embed] });
                }
            }
            else
            {
                client.channels.cache.get(row[0].channel).send('Error: ' + err);
            }
        });
    }
    catch(error)
    {
        client.channels.cache.get('946830760839610460').send('error: ' + error);
        console.log(error);   
    }
});

client.on('guildMemberRemove', (member) => 
{
    try
    {
        con.query('select channel from welcome_goodbye where server = "' + member.guild.id + '"', (err, row) => 
        {
            if(err == null)
            {
                if(row.length > 0)
                {
                    let permissions = client.channels.cache.get(row[0].channel).permissionsFor(member.guild.me).toArray();
                    if(permissions.indexOf('SEND_MESSAGES') == -1){return}
                    const embed = new MessageEmbed()
                        .setColor('#ff0000')
                        .setTitle('Goodbye from the Server')
                        .setAuthor({name: member.displayName, iconURL: member.displayAvatarURL()})
                        .setDescription(member.displayName + ' just left us! ' + EMOJIS.hide);
                    
                    client.channels.cache.get(row[0].channel).send({ embeds: [embed] });
                }
            }
            else
            {
                client.channels.cache.get(row[0].channel).send('Error: ' + err);
            }
        });
    }
    catch(error)
    {
        client.channels.cache.get('946830760839610460').send('error: ' + error);
        console.log(error);   
    }
});

client.on('interactionCreate', async interaction => {
    try
    {
        if(interaction.isCommand())
        {
            try
            {
                if(interaction.guild)
                {
                    let permissions = interaction.channel.permissionsFor(interaction.guild.me).toArray();
                    if(permissions.indexOf('SEND_MESSAGES') == -1)
                    {
                        interaction.reply({content: 'Sorry, i can\'t send messages here ' + EMOJIS.hide, ephemeral: true,});
                        return;
                    }
                }
                const run = require('./commands/' + interaction.commandName);
                run(null, null, client, con, interaction);
                delete require.cache[require.resolve('./commands/' + interaction.commandName)];
    
            }
            catch(error){client.bwe.theError(error, null, interaction)}
        }
    
        if(interaction.isButton())
        {
            const name = interaction.message.interaction.commandName;
            const id = interaction.customId;
            if(name == 'pic' || name == 'oc')
            {
                if(interaction.member.id != interaction.message.interaction.user.id){return;}
                if(id == 'left' || id == 'right')
                {
                    
                    let filesArray = [];
                    const directory = interaction.message.embeds[0].title;
                    await client.bwe.crawl(name + '\\' + directory,filesArray);
                    if(filesArray.length > 1)
                    {
                        const footer = interaction.message.embeds[0].footer.text;
                        let picNum = footer.slice(0, footer.indexOf('/')) * 1 - 1;
                        if(id == 'left'){picNum--;}
                        if(picNum == -1){picNum = filesArray.length - 1;}
                        if(id == 'right'){picNum++;}
                        if(picNum == filesArray.length){picNum = 0;}
                        const text = (picNum + 1) + '/' + filesArray.length;
                        const theEnd = filesArray[picNum].slice(filesArray[picNum].indexOf('.'));
                        const attachment = new Discord.MessageAttachment(filesArray[picNum], 'att' + theEnd);
                        const embed = new MessageEmbed()
                        .setTitle(directory)
                        .setColor(client.bwe.AzorDefaultColor)
                        .setImage('attachment://att' + theEnd)
                        .setFooter({ text: text});
                        interaction.update({ embeds: [embed] ,files: [attachment]});
                    }
                }
                if(id == 'delete')
                {
                    interaction.message.delete();
                }
            }
        }
    }
    catch(error){client.bwe.theError(error, null, interaction)}
});

//===== LOGINING IN ================

con.connect(err => {
    if(err) return console.log(err);
    console.log('MySQL has been connected!');
});

client.login(DATA.token);