// -------------------------------- consts --------------------------------
const TheTest = process.argv[2] == 'test';
const AzorActivity = 'bweeing';
const Discord = require('discord.js');
const client = new Discord.Client({intents: 32767, partials: ['CHANNEL']});
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const path = require('path');
const fsPromises = fs.promises;
const DATA = TheTest ? require('./testdata.json') : require('./data.json');
const ChannlesList = require('./jsony/channels.json');
const mysql = require('mysql');
const EMOJIS = require('./jsony/emoji.json');
const POKEMON_TYPES = require('./jsony/pokemontypes.json');

const AzorModules =
{
    PMDRP: require('./azormodule/pmdrp'),
    stuffs: require('./azormodule/stuffs'),
    extras: require('./azormodule/extras')
}

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
            if(POKEMON_TYPES[i].english == _name){return i}
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
}
client.bwe = new BweClass();

// -------------------------------- variable ------------------------------
let con = mysql.createConnection({host:'localhost', user: 'root', password: '', database: 'azorbot'});
let allIsOk = true;
let VALUE;

// -------------------------------- client on -------------------------------------------
client.on('ready', () => 
{
    if(TheTest){console.log('The test is working');}
    else{console.log('It\'s working');}

    con.query('select * from pokemonList', (err, row) => 
    {
        for(let i = 0; i < row.length; i++)
        {
            client.bwe.pokemonList[i] =
            {
                name: row[i]['name'],
                types: row[i]['types'].split(','),
                abilities: [row[i]['ability1'], row[i]['ability2']],
                hp: row[i]['hp'],
                attack: row[i]['attack'],
                defence: row[i]['defence'],
                spAttack: row[i]['specialattack'],
                spDefence: row[i]['specialdefence'],
                speed: row[i]['speed'],
                femaleChance: row[i]['femalechance']
            }
        }
    });

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

        const permissions = message.channel.permissionsFor(message.guild.me).toArray();
        if(permissions.indexOf('SEND_MESSAGES') == -1){return}

        if(!TheTest)//connection channel
        {
            con.query('select code from connect_channel where channel = "' + message.channel.id + '";', (error, result) =>
            {
                if(error == null)
                {
                    if(result[0] != undefined && result[0].code != 'none')
                    {
                        con.query('select channel from connect_channel where code = "' + result[0].code + '";', async (err, r_channels) =>
                        {
                            if(error == null)
                            {
                                for(let i = 0; i < r_channels.length; i++)
                                {
                                    if(message.channel.id != r_channels[i].channel)
                                    {
                                        let channel = client.channels.cache.get(r_channels[i].channel);
                                        let webhooks = await channel.fetchWebhooks();
                                        let webhook = webhooks.find(wh => wh.token);
                                        if (!webhook) 
                                        {
                                          await channel.createWebhook('AzorBot', {avatar: ''});
                                          webhooks = await channel.fetchWebhooks();
                                          webhook = webhooks.find(wh => wh.token);
                                        }
                                        let theFiles = [];
                                        message.attachments.forEach(att =>
                                        {
                                            theFiles[theFiles.length] = att.url;
                                        });
                                        if(message.content == ''){message.content = '_ _'}
    
                                        let theSticker = '';
                                        if(message.stickers.size > 0)
                                        {
                                            message.content = 'sticker';
                                            console.log(typeof(message.stickers.firstKey()));
                                            theSticker = ({
                                                id: message.stickers.firstKey(),
                                                description: null,
                                                type: null,
                                                format: 'LOTTIE',
                                                name: 'Sticker',
                                                packId: null,
                                                tags: null,
                                                available: null,
                                                guildId: null,
                                                user: null,
                                                sortValue: null
                                            });
                                        
                                        }
                                        
                                        await webhook.send(
                                        {
                                            content: message.content,
                                            username: message.member.displayName + ' (from ' + message.guild.name + ')',
                                            avatarURL: message.member.displayAvatarURL(),
                                            files: theFiles,
                                            embeds: message.embeds,
                                            stickers: [theSticker],
                                        });
                                    }
                                }
                            }
                            else
                            {
                                message.channel.send('error: ' + err);
                            }
    
                        });
                    }
                }
                else
                {
                    message.channel.send('error: ' + error);
                }
            });
        }

        if(message.guild == null){return false;}
        
        if(!TheTest)//experience
        {
            con.query('select channel from levelup_channel where guild = "' + message.guild.id + '"', (error, result) =>
        {
            if(error == null)
            {
                if(result.length > 0)
                {
                    con.query('select date, exp, level, now() as now from levelup_people where guild = "' + message.guild.id + '" and member = "' + message.author.id + '"', (err, res) => 
                    {
                        if(err == null)
                        {
                            if(res.length == 0)
                            {
                                con.query('insert into levelup_people (guild, member, date) values ("' + message.guild.id + '","' + message.author.id + '", now())', (errors, _) =>
                                {
                                    if(errors == null)
                                    {
                                        //działa
                                    }
                                    else
                                    {
                                        message.channel.send('error: ' + errors);
                                    }
                                });
                            }
                            else
                            {
                                if(((res[0].now - res[0].date) / 1000) > 60)
                                {
                                    let laExp = res[0].exp + Math.ceil(Math.random() * 3);
                                    let laLv = res[0].level;
                                    const NEXT_LEVEL = laLv * 15 + 10;

                                    if(laExp >= NEXT_LEVEL)
                                    {
                                        laExp -= NEXT_LEVEL;
                                        laLv++;
                                        const theChannel = result[0].channel == 'here'? message.channel: client.channels.cache.get(result[0].channel);
                                        let perm = theChannel.permissionsFor(message.guild.me).toArray();
                                        if(perm.indexOf('SEND_MESSAGES') >= 0)
                                            theChannel.send('Yea, <@!' + message.member.id + '> just reached level **' + laLv + '**! ' + EMOJIS.vibbing);
                                    }

                                    con.query('update levelup_people set exp = ' + laExp + ', level = ' + laLv + ', date = now() where guild = "' + message.guild.id + '" and member = "' + message.author.id + '"', (errors, _) =>
                                    {
                                        if(errors == null)
                                        {
                                            
                                        }
                                        else
                                        {
                                            message.channel.send('error: ' + errors);
                                        }
                                    });
                                }
                            }
                        }
                        else
                        {
                            message.channel.send('Error: ' + err);
                        }
                    });
                }
            }
            else
            {
                message.channel.send('Error: ' + error);
            }
        });}

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

        if(itsNotMe && message.content.toLocaleLowerCase().startsWith('bwe'))
        {
            let msg = message.content;
            let yes = true;
            let wykrzyknik = '';
            while(msg[msg.length - 1] == '!')
            {
                msg = msg.slice(0, -1);
                wykrzyknik += '!';
                console.log(msg);
            }
            for(let i = 3; i < msg.length; i++)
            {
                if(msg[i] != 'e' && msg[i] != 'E'){yes = false;}
            }
            if(yes)
            {
                if(message.content.length >= 2000){message.channel.send('yeshanium Z ' + EMOJIS.vibbing);}
                else{message.channel.send(msg + 'e' + wykrzyknik);}
            }
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

            case 'powiedz':
                if(arguments[1] != undefined)
                {
                    text = arguments[1];
                    for(let i = 2; i < arguments.length; i++)
                    {
                        text += ' ' + arguments[i];
                    }
                    if(message.mentions.channels.first())
                    {
                        message.mentions.channels.first().send(text);
                        client.bwe.deleteMessage(message);
                    }
                    else if(arguments[0] == 'here')
                    {
                        message.channel.send(text);
                        client.bwe.deleteMessage(message);
                    }
                    else if(ChannlesList[arguments[0]] == undefined)
                    {
                        message.channel.send('i don\'t know this channel');
                    }
                    else
                    {
                        client.channels.cache.get(ChannlesList[arguments[0]]).send(text);
                        client.bwe.deleteMessage(message);
                    }

                }
            break;
            case 'admin':
                if(client.bwe.isItAdmin(message))
                {
                    if(arguments[0] == undefined){arguments[0] = ''}
                    if(arguments[1] == undefined){arguments[1] = ''}
                    switch(arguments[0].toLowerCase())
                    {
                        case 'add':
                            switch(arguments[1].toLowerCase())
                            {
                                case 'pokemon': 
                                    if(arguments.length == 14)
                                    {
                                        client.bwe.addNewPokemon(arguments[2], arguments[3], arguments[4], arguments[5], arguments[6], arguments[7], arguments[8], arguments[9], arguments[10], arguments[11], arguments[12], arguments[13], message);
                                    }
                                    else
                                    {
                                        message.channel.send('Wrong number of arguments: add pokemon [name] [type1] [type2] [ability1] [ability2] [hp] [attack] [defence] [special attack] [special defence] [speed] [female chance]');
                                    }
                                break;

                                default: message.channel.send('Wrong command.\nAvailable add: pokemon');
                            }
                        break;
                        case 'edit':
                            switch(arguments[1].toLowerCase())
                            {
                                case 'pokemon':
                                    if(arguments[4] == undefined)
                                    {

                                    }
                                    else
                                    {
                                        const PKMN = client.bwe.getPokemonNumberByName(arguments[2]);
                                        if(PKMN == -1)
                                        {
                                            message.channel.send('There is no pokemon with name "' + arguments[2] + '" in my database.');
                                        }
                                        else
                                        {
                                            let stuffs = '';
                                            switch(arguments[3])
                                            {
                                                case 'name': 
                                                    if(client.bwe.getPokemonNumberByName(arguments[4]) == -1)
                                                    {
                                                        stuffs = 'name = "' + arguments[4] + '"';
                                                        client.bwe.pokemonList[PKMN].name = arguments[4];
                                                    }
                                                    else
                                                    {
                                                        message.channel.send('This name is used by another pokemon.');
                                                    }
                                                break;
                                                case 'types':
                                                    allIsOk = true;
                                                    const types = [client.bwe.getTypeNumberByName(arguments[4]),client.bwe.getTypeNumberByName(arguments[5])]
                                                    if(arguments[4] == arguments[5]){message.channel.send('Pokemon can\'t have both the same type, if you want to make pokemon single type write - as second type'); allIsOk = false;}
                                                    if(types[0] == -1){message.channel.send('there is no "' + arguments[4] + '" type'); allIsOk = false;}
                                                    if(types[1] == -1){message.channel.send('there is no "' + arguments[5] + '" type'); allIsOk = false;}
                                                    if(allIsOk)
                                                    {
                                                        stuffs = 'types = "' + types[0] + ',' + types[1] + '"';
                                                        client.bwe.pokemonList[PKMN].types = [types[0],types[1]];
                                                    }
                                                break;
                                                case 'abilities':
                                                    allIsOk = true;
                                                    const abilities = [arguments[4],arguments[5]]
                                                    if(arguments[4] == arguments[5]){message.channel.send('Pokemon can\'t have both the same abilities, if you want to make pokemon with one write - as second ability'); allIsOk = false;}
                                                    if(allIsOk)
                                                    {
                                                        stuffs = 'ability1 = "' + abilities[0] + '", ability2 = "' + abilities[1] + '"';
                                                        client.bwe.pokemonList[PKMN].abilities = [abilities[0],abilities[1]];
                                                    }
                                                break;
                                                case 'hp': case 'attack': case 'defence': case 'specialdefence': case 'specialattack': case 'speed':
                                                    VALUE = arguments[4] * 1;
                                                    if(isNaN(VALUE)){message.channel.send('Please write number as value.');}
                                                    else if(VALUE < 1){message.channel.send('value of stats must be not less than 1');}
                                                    else if(VALUE > 256){message.channel.send('value of stats must be not more than 256');}
                                                    else
                                                    {
                                                        stuffs = arguments[3] + ' = ' + VALUE;
                                                        let stat = arguments[3];
                                                        if(arguments[3] == 'specialattack'){stat = 'spAttack';}
                                                        if(arguments[3] == 'specialdefence'){stat = 'spDefence';}
                                                        client.bwe.pokemonList[PKMN][stat] = VALUE;
                                                    }
                                                break;
                                                case 'femalechance': case 'femalerate':
                                                    VALUE = arguments[4] * 1;
                                                    if(isNaN(VALUE)){message.channel.send('Please write number as value.');}
                                                    else if(VALUE < -1){message.channel.send('chance must be not less than -1');}
                                                    else if(VALUE > 100){message.channel.send('chance must be not more than 100');}
                                                    else
                                                    {
                                                        stuffs = 'femalechance = ' + VALUE;
                                                        client.bwe.pokemonList[PKMN].femaleChance = VALUE;
                                                    }
                                                break;
                                                
                                                default: message.channel.send('There is no property with name "' + arguments[3] + '" in my database.');
                                            }

                                            if(stuffs != '')
                                            {
                                                con.query('update pokemonList set ' + stuffs + ' where name = "' + arguments[2] + '"', (err,row) => {
                                                    if(err == null)
                                                    {
                                                        message.channel.send('Done.');
                                                    }
                                                    else
                                                    {
                                                        message.channel.send('error: ' + err);
                                                    }
                                                });
                                            }
                                        }
                                    }
                                break;
                                default: message.channel.send('Wrong command.\nAvailable edit: pokemon');
                            }
                        break;

                        default: message.channel.send('Avaliable admin function: add, edit');
                    }
                }
                else{message.channel.send('Sorry, you don\'t have permission to use this command');}
            break;
            case 'connectchannel': 
            {
                if(arguments[0] == undefined)
                {
                    con.query('select code from connect_channel where channel = "' + message.channel.id + '";', (error, result) => 
                    {
                        if(error == null) 
                        {
                            if(result[0] == undefined)
                            {
                                message.channel.send('Send connection code 1 - 100 symbols ' + EMOJIS.sip);
                            }
                            else
                            {
                                message.channel.send('Your connection code is ' + result[0].code + ' ' + EMOJIS.sip);
                            }
                        }
                        else 
                        {
                            message.channel.send('error: ' + error);
                        }
                    });
                
                    return false;
                }
                if(arguments[0].length > 100)
                {
                    message.channel.send('Your connection code is too long (max 100) ' + EMOJIS.hide);
                    return false;
                }
                con.query('select code from connect_channel where channel = "' + message.channel.id + '";', (error, result) => 
                {
                    if(error == null) 
                    {
                        if(result[0] == undefined)
                        {
                            con.query('insert into connect_channel(channel, code) values ("' + message.channel.id + '","' + arguments[0] + '");', (e) => 
                            {
                                if(e == null){message.channel.send('Code set ' + EMOJIS.vibbing)}
                                else{message.channel.send('error: ' + e);}
                            });
                        }
                        else
                        {
                            con.query('update connect_channel set code = "' + arguments[0] + '" where channel = "' + message.channel.id + '";', (e) => 
                            {
                                if(e == null){message.channel.send('Code set ' + EMOJIS.vibbing)}
                                else{message.channel.send('error: ' + e);}
                            });
                        }
                    }
                    else 
                    {
                        message.channel.send('error: ' + error);
                    }
                });
            }
            break;
            case 'stoptest':
                if(TheTest)
                {
                    await message.channel.send('Test stop!');
                    client.user.setActivity({name: AzorActivity, type: 2});
                    process.exit();
                }

            default:
                let canWeGoAhaed = false;
                await AzorModules.extras(aMessage, client).then(result => {canWeGoAhaed = result}); if(!canWeGoAhaed){return false;}
                await AzorModules.stuffs(aMessage, client, con).then(result => {canWeGoAhaed = result}); if(!canWeGoAhaed){return false;}
                await AzorModules.PMDRP(aMessage, client, con).then(result => {canWeGoAhaed = result}); if(!canWeGoAhaed){return false;}
                message.channel.send('use ' + DATA.prefix + 'help or ' + DATA.mention + ' help or /help to check the command list');
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
            let permissions = interaction.channel.permissionsFor(interaction.guild.me).toArray();
            if(permissions.indexOf('SEND_MESSAGES') == -1)
            {
                interaction.reply({content: 'Sorry, i can\'t send messages here ' + EMOJIS.hide, ephemeral: true,});
                return;
            }
            const run = require('./commands/' + interaction.commandName);
            run(null, client, con, interaction);
            delete require.cache[require.resolve('./commands/' + interaction.commandName)];

        }
        catch(error)
        {
            interaction.reply('Some error happened. ' + EMOJIS.blush);
            client.channels.cache.get('946830760839610460').send('error: ' + error);
            console.log(error);
        }
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