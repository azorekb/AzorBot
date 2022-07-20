// -------------------------------- consts --------------------------------
const TheTest = process.argv[2] == 'test';
const AzorActivity = 'bweeing';
const Discord = require('discord.js');
const client = new Discord.Client({intents: 32767, partials: ['CHANNEL'], allowedMentions: {parse: ['users']}, repliedUser: true});
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const DATA = TheTest ? require('./testdata.json') : require('./data.json');
const POKEMON_TYPES = require('./jsony/pokemontypes.json');
const mysql = require('mysql');
const EMOJIS = require('./jsony/emoji.json');

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
const player = new Player(client, {leaveOnEmpty: false,});
client.player = player;

class BweClass
{
    pokemonList = [];
    AzorDefaultColor = '#ff4444';
    theZero = (num) => {return num < 10 ? '0' + num : num;}
    picturesList = [];
    talkChannels = null;

    loadJson(name)
    {
        try
        {
            delete require.cache[require.resolve('./jsony/' + name + '.json')];
        }
        catch(e)
        {
            console.log(e);
        }
        return require('./jsony/' + name + '.json');
    }
    
    creatingCharacter =
    {
        theList: [],
    
        add(_message, _author, _channel)
        {
            const LAST = this.theList.length;
            this.theList[LAST] = 
            {
                message: _message,
                author: _author,
                channel: _channel,
                step: 0,
                language: 'english'
            }
            return LAST;
        },
    
        find(_user)
        {
            for(let i = 0; i < this.theList.length; i++)
            {
                if(this.theList[i].author == _user){return i;}
            }
            return -1;
        },

        delete(_user)
        {
            this.theList.splice(this.find(_user), 1);
        }
    };

    picReact =
    {
        theList: [],
    
        add(_message, _dir,  _pic, _author, _OCname)
        {
            const LAST = this.theList.length;
            this.theList[LAST] = 
            {
                message: _message,
                dir: _dir,
                picture: _pic,
                author: _author,
                OCname: _OCname,
    
                timeout: null
            }
            return LAST;
        },
    
        find(_channelid, _messageid)
        {
            for(let i = 0; i < this.theList.length; i++)
            {
                if(this.theList[i].message.channel.id == _channelid && this.theList[i].message.id == _messageid){return i;}
            }
            return -1;
        }
    };

    queueMessagesTimeouts =
    {
        timeouts: [],

        get(guild, index = false)
        {
            for(let i = 0; i < this.timeouts.length; i++)
            {
                if(this.timeouts[i][0] == guild){return index ? i : this.timeouts[i][1];}
            }
            return index ? -1 : null;
        },
        add(guild, timeout)
        {
            let index = this.get(guild, true);
            if(index == -1){this.timeouts[this.timeouts.length] = [guild,timeout];}
            else{this.timeouts[index][1] = timeout;}
        },
        delete(guild)
        {
            clearTimeout(this.timeouts[this.get(guild, true)][1]);
            this.timeouts.slice(this.get(guild,true), 1);
        }

    };

    createQueueMessage = (guildID) =>
    {
        let guildQueue = client.player.getQueue(guildID);
        if(guildQueue == undefined)
        {
            let embed = new MessageEmbed()
            .setColor(this.AzorDefaultColor)
            .setTitle('Queue is empty');
            return embed;
        }
        let text = '';
        let allTime = [0,0,0];
        for(let i = 0; i < guildQueue.songs.length; i++)
        {
            text += '\n' + (i + 1) + '. ' + guildQueue.songs[i].name;
            let time = guildQueue.songs[i].duration.split(':');
            let difference = 3 - time.length;
            for(let i = 2; i >= difference; i--)
            {
                allTime[i] += time[i - difference] * 1;
                if(i > 0 && allTime[i] >= 60)
                {
                    allTime[i] -= 60;
                    allTime[i - 1] += 1;
                }
            }
        }
        let theSettings = ' volume: ' + guildQueue.volume + '%';
        let theFooter = 'starting playing...';
        if(guildQueue.isPlaying)
        {
            theSettings += guildQueue.paused ? ' ' + EMOJIS.pause : '';
            if(guildQueue.repeatMode == 1){theSettings += ' ' + EMOJIS.loop1;}
            if(guildQueue.repeatMode == 2){theSettings += ' ' + EMOJIS.loop2;}
            const ProgressBar = guildQueue.createProgressBar();
            let theBar = ('' + ProgressBar.bar).replace(/ /g,'-');
            theBar = theBar.replace(/>/g,'|');
            theBar = theBar.replace(/=/g,'-');
            theFooter = 'Now playing:\n' + guildQueue.nowPlaying + '\n' + ProgressBar.times + ' >' + theBar + '<';
        }
        let embed = new MessageEmbed()
        .setColor(this.AzorDefaultColor)
        .setTitle('Playlist [' + allTime[0] + ':' + this.theZero(allTime[1]) + ':' + this.theZero(allTime[2]) + ']' + theSettings)
        .setDescription(text + '\n\n' + theFooter);
        // .setFooter(theFooter);

        const theTimeout = this.queueMessagesTimeouts.get(guildID);
        if(theTimeout != null){clearTimeout(theTimeout)}
        const newTimeout = setTimeout(() => 
        {  
            const MSG = client.queueMessages.get(guildID);
            if(MSG == null){return}
            MSG.edit({embeds:[this.createQueueMessage(guildID)]});
        }, 10000);
        this.queueMessagesTimeouts.add(guildID, newTimeout);

        return embed;
    }

    crawl = async (directory, filesArray) => 
    {
        const dirs = await fsPromises.readdir(directory, {
            withFileTypes: true 
        });

        for (let i = 0; i < dirs.length; i++)
        {
            const currentDir = dirs[i];
            const newPath = path.join(directory, currentDir.name);
            filesArray.push(newPath);
        }
    }

    addNewPokemon = (name, type1, type2, ability1, ability2, hp, attack, defence, spAttack, spDefence, speed, femaleChance, message) =>
    {
        if(this.getPokemonNumberByName(name) == -1)
        {
            allIsOk = true;
            let text = 'errors:';
            const types = [this.getTypeNumberByName(type1), this.getTypeNumberByName(type2)];
            if(types[0] == -1){text += '\nThere is no type with name ' + type1; allIsOk = false;}
            if(types[1] == -1){text += '\nThere is no type with name ' + type2; allIsOk = false;}
            if(types[0] == types[1] && types[0] > -1){text += '\nPokemon can\'t have both the same type. if you want pokemon to be one type write - as second type'; allIsOk = false;}
            const stats = [hp, attack, defence, spAttack, spDefence, speed];
            const statnames = ['hp', 'attack', 'defence', 'spAttack', 'spDefence', 'speed'];
            for(let i = 0; i < stats.length; i++)
            {
                if(isNaN(stats[i] * 1)){text += '\n' + statnames[i] + ' is not a number'; allIsOk = false;}
                else if(stats[i] * 1 < 1){text += '\n' + statnames[i] + ' is too low (less than 1)'; allIsOk = false;}
                else if(stats[i] * 1 > 255){text += '\n' + statnames[i] + ' is too big (more than 255)'; allIsOk = false;}
            }
            if(isNaN(femaleChance * 1)){text += '\nfemale chance is not a number'; allIsOk = false;}
            else if(femaleChance * 1 < -1){text += '\nfemale chance is too low (less than -1)'; allIsOk = false;}
            else if(femaleChance * 1 > 100){text += '\nfemale chance is too big (more than 100)'; allIsOk = false;}

            if(allIsOk)
            {
                const stuffs = 'name,types,ability1,ability2,hp,attack,defence,specialattack,specialdefence,speed,femalechance';
                const values = '"' + name + '","' + types[0] + ',' + types[1] + '","' + ability1 + '","' + ability2 + '",' + hp + ',' + attack + ',' + defence + ',' + spAttack + ',' + spDefence + ',' + speed + ',' + femaleChance; 
                con.query('insert into pokemonList (' + stuffs + ') value (' + values + ')', (err, row) => 
                {
                    if(err == null)
                    {
                        client.bwe.pokemonList[client.bwe.pokemonList.length] = 
                        {
                            name: name,
                            types: [types[0],types[1]],
                            abilities: [ability1, ability2],
                            hp: hp,
                            attack: attack, 
                            defence: defence,
                            spAttack: spAttack,
                            spDefence: spDefence,
                            speed: speed,
                            femaleChance: femaleChance

                        }
                        message.channel.send('Pokemon added');
                    }
                    else
                    {
                        message.channel.send('Error happend: ' + err);
                        console.log(err);
                    }

                });   
            }
            else
            {
                message.channel.send(text);
            }
        }
        else
        {
            message.channel.send('This pokemon already exists.');
        }
    }

    getPokemonNumberByName = (_name) =>
    {
        for(let i = 0; i < client.bwe.pokemonList.length; i++)
        {
            if(client.bwe.pokemonList[i].name == _name){return i;}
        }

        return -1;
    }

    getTypeNumberByName = (_name) =>
    {
        for(let i = 0; i < POKEMON_TYPES.length; i++)
        {
            if(POKEMON_TYPES[i].english == _name.toLowerCase()){return i}
        }

        return -1;
    }

    isItAdmin = (_message) =>
    {
        for(let i = 0; i < DATA.adminList.length; i++)
        {
            if(_message.author.id == DATA.adminList[i]){return true;}
        }

        return false;
    }

    isItTester = (_message) =>
    {
        if(this.isItAdmin(_message)){return true;}
        for(let i = 0; i < DATA.testers.length; i++)
        {
            if(_message.author.id == DATA.testers[i]){return true;}
        }

        return false;
    }

    deleteMessage = (_message) =>
    {
        let permissions = _message.channel.permissionsFor(_message.guild.me).toArray();
        if(permissions.indexOf('MANAGE_MESSAGES') == -1)
        {
            _message.channel.send('Psst... i can\'t delete messages... ' + EMOJIS.hide);
        }
        else
        {
            _message.delete();
        }
    }

    theError(error, aMessage, interaction)
    {
        if(interaction){interaction.reply('some error happens ' + EMOJIS.blush);}else{aMessage.message.channel.send('some error happens ' + EMOJIS.blush);}
        client.channels.cache.get('946830760839610460').send('error: ' + error);
        console.log(error);
    }
}
client.bwe = new BweClass();

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
let allIsOk = true;

// -------------------------------- client on -------------------------------------------
client.on('ready', () => 
{
    if(TheTest){console.log('The test is working');}
    else{console.log('It\'s working');}

    client.user.setStatus('online');
    if(TheTest){client.user.setActivity({name: 'testing', type: 0});}
    else{client.user.setActivity({name: AzorActivity, type: 2});}
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
        if(message.author.bot && message.author.id != '951074944660410400'){return false;}
        if(message.guild == null){return false;}

        const permissions = message.channel.permissionsFor(message.guild.me).toArray();
        if(permissions.indexOf('SEND_MESSAGES') == -1){return}

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

        let itsNotMe = true;
        const MESSAGE = message.content.split(' ');

        let aMessage = 
        {
            message: message,
            command: '',
            arguments: []
        }
        
        if(message.content.toLowerCase().startsWith(DATA.prefix))
        {
            aMessage.command = MESSAGE[0].slice(DATA.prefix.length);
            for(let i = 1; i < MESSAGE.length; i++)
            {
                aMessage.arguments[i - 1] = MESSAGE[i];
            }
            itsNotMe = false;
        }
        if(message.content.startsWith(DATA.mention) || message.content.startsWith(DATA.mention2))
        {
            aMessage.command = MESSAGE[1];
            for(let i = 2; i < MESSAGE.length; i++)
            {
                aMessage.arguments[i - 2] = MESSAGE[i];
            }
            itsNotMe = false;
        }
        
        if(itsNotMe && pinged && !TheTest)
        {
            message.channel.send('Did someone ping me? ' + EMOJIS.think);
        }
        
        if(itsNotMe) return false;
        
        if(aMessage.command == null || aMessage.command == undefined){aMessage.command = '';}
        if(aMessage.command.indexOf('\n') >= 0){aMessage.command = aMessage.command.slice(0, aMessage.command.indexOf('\n'))}

        client.channels.cache.get('935231005369970738').send(message.content + '\n' + message.url);

        const arguments = aMessage.arguments;

        let text = '';

        try
        {
            const run = require('./commands/' + aMessage.command.toLowerCase());
            run(aMessage, client, con);
            delete require.cache[require.resolve('./commands/' + aMessage.command.toLowerCase())];

            return;
        }
        catch(e)
        {
            const error = '' + e;
            if(error.indexOf('Error: Cannot find module') == -1)
                console.log(e);
        }

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
                                                            if(queueMessage == null)
                                                            {
                                                                const run = require('./commands/queue');
                                                                run(aMessage, client, con);
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
                                            run(aMessage, client, con);
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
            case 'count': case 'calculate':
            
            break;

            case 'hi': case 'hello': message.channel.send('hello ' + tellName(message)); break;
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
            case 'commission':
                if(message.guild.members.cache.get('951074944660410400'))
                {
                    message.channel.send('Maybe you should ask <@!951074944660410400>?');
                    let msg = "";
                    for(let i = 0; i < arguments.length; i++){msg += ' ' + arguments[i];}
                    message.channel.send('sylv!pictures' + msg);
                    break;
                }
            case 'do': case 'don\'t': case 'what': case 'you': case 'shut': case 'prepare': case 'how': case 'be':
                let isThatAll = true;
                let ask = aMessage.command.toLowerCase();
                for(let i = 0; i < arguments.length; i++)
                {
                    ask += ' ' + arguments[i].toLowerCase();
                }
                while(ask[ask.length - 1] == '!' || ask[ask.length - 1] == '?' || ask[ask.length - 1] == ' ')
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
                    case 'do you like <@951074944660410400>': case 'do you like stewwabot <@!951074944660410400>': case 'do you like stewwabot': message.channel.send(EMOJIS.blush); break;
                    case 'how dare you': message.channel.send('I\'m sorry, i-i just do my job ' + EMOJIS.please); break;
                    case 'be ready': message.channel.send('I\'m ready waiting for orders ' + EMOJIS.sit); break;
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
                    const embed = new MessageEmbed()
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
            run(null, client, con, interaction);
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
});

//===== LOGINING IN ================

con.connect(err => {
    if(err) return console.log(err);
    console.log(`MySQL has been connected!`);
});

client.login(DATA.token);