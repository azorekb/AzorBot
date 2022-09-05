const POKEMON_TYPES = require('./jsony/pokemontypes.json');
const EMOJIS = require('./jsony/emoji.json');
const fs = require('fs');
const path = require('path');
const Discord = require('discord.js');
const fsPromises = fs.promises;
class bwe
{
    pokemonList = [];
    AzorDefaultColor = '#ff4444';
    theZero(num){return num < 10 ? '0' + num : num;};
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

    battle =
    {
        theList: [],
    
        add(_message, _author, _channel, _pictures)
        {
            const LAST = this.theList.length;
            this.theList[LAST] = 
            {
                message: _message,
                author: _author,
                channel: _channel,
                language: 'english',
                pictures: _pictures
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
    }

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
    }

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

    }

    createQueueMessage(guildID, client)
    {
        let guildQueue = client.player.getQueue(guildID);
        if(guildQueue == undefined)
        {
            let embed = new Discord.MessageEmbed()
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
        let embed = new Discord.MessageEmbed()
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
            MSG.edit({embeds:[this.createQueueMessage(guildID, client)]});
        }, 10000);
        this.queueMessagesTimeouts.add(guildID, newTimeout);

        return embed;
    }

    crawl = async(directory, filesArray) =>
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

    getPokemonNumberByName(_name)
    {
        for(let i = 0; i < this.pokemonList.length; i++)
        {
            if(this.pokemonList[i].name == _name){return i;}
        }

        return -1;
    }

    getTypeNumberByName(_name)
    {
        for(let i = 0; i < POKEMON_TYPES.length; i++)
        {
            if(POKEMON_TYPES[i].english == _name.toLowerCase()){return i}
        }

        return -1;
    }

    isItAdmin(_message)
    {
        for(let i = 0; i < DATA.adminList.length; i++)
        {
            if(_message.author.id == DATA.adminList[i]){return true;}
        }

        return false;
    }

    isItTester(_message)
    {
        if(this.isItAdmin(_message)){return true;}
        for(let i = 0; i < DATA.testers.length; i++)
        {
            if(_message.author.id == DATA.testers[i]){return true;}
        }

        return false;
    }

    deleteMessage(_message)
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
        console.log(error);
        if(aMessage == null && interaction == null){return}
        if(interaction){interaction.reply('some error happens ' + EMOJIS.blush);}else{aMessage.message.channel.send('some error happens ' + EMOJIS.blush);}
    }
}
module.exports = () => {return new bwe()}