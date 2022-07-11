const EMOJIS = require('./jsony/emoji.json');
const POKEMON = require('./jsony/pokemon.json');
const QUESTIONS = require('./jsony/questions.json').list;
const TEXTS = require('./jsony/texts.json').newCharacter;
const { MessageEmbed } = require('discord.js');

const getPokemonNumberByName = (_name) =>
{
    for(let i = 0; i < POKEMON.list.length; i++)
    {
        if(POKEMON.list[i][0].toLowerCase() == _name.toLowerCase()){return i;}
    }

    return -1;
}

function sendData(progress, con, pokemonDispaly)
{
    progress.message.edit(pokemonDispaly + '\n\nokie. now i will send it to Database...');
    con.query('select * from players where user = "' + message.author.id + '";', (error, row) =>
    {
        if(error)
        {
            message.channel.send('error: ' + error);
        }
        else
        {
            if(row.length)
            {
                con.query('update players set name = "' + progress.data.nickname + '", specie = "' + progress.data.pokemon + '", form = "' + progress.data.form + '", gender = "' + progress.data.gender + '", imgURL = "' + progress.data.img + '" where user = "' + message.author.id + '";', (err, nothing) =>{
                    if(err)
                    {
                        message.channel.send('error: ' + err);
                    }
                    else
                    {
                        progress.message.edit(pokemonDispaly + '\n\nYour character has been updated!');
                        client.bwe.creatingCharacter.delete(message.author.id);
                    }
                });
            }
            else
            {
                con.query('insert into players (user, name, specie, form, gender, imgURL) values ("' + message.author.id + '", "' + progress.data.nickname + '", "' + progress.data.pokemon + '", "' + progress.data.form + '", "' + progress.data.gender + '", "' + progress.data.img + '");', (err, nothing) =>{
                    if(err)
                    {
                        message.channel.send('error: ' + err);
                    }
                    else
                    {
                        progress.message.edit(pokemonDispaly + '\n\nYour character has been created!');
                        client.bwe.creatingCharacter.delete(message.author.id);
                    }
                });
            }
        }
    })
}

const NATURES =
[
    {name: 'mysterious ', plus: 0, minus: 0},
    {name: 'lazy', plus: 0, minus: 1},
    {name: 'self-destructive', plus: 0, minus: 2},
    {name: 'pessimist', plus: 0, minus: 3},
    {name: 'holy', plus: 0, minus: 4},
    {name: 'lickerish ', plus: 0, minus: 5},
    {name: 'strong', plus: 0, minus: 6},

    {name: 'sadist', plus: 1, minus: 0},
    {name: 'hardy', plus: 1, minus: 1},
    {name: 'lonely', plus: 1, minus: 2},
    {name: 'adamant', plus: 1, minus: 3},
    {name: 'naughty', plus: 1, minus: 4},
    {name: 'brave', plus: 1, minus: 5},
    {name: 'belligerent', plus: 1, minus: 6},

    {name: 'masochist', plus: 2, minus: 0},
    {name: 'bold', plus: 2, minus: 1},
    {name: 'docile', plus: 2, minus: 2},
    {name: 'impish', plus: 2, minus: 3},
    {name: 'lax', plus: 2, minus: 4},
    {name: 'relaxed', plus: 2, minus: 5},
    {name: 'reasonable', plus: 2, minus: 6},

    {name: 'rough', plus: 3, minus: 0},
    {name: 'modest', plus: 3, minus: 1},
    {name: 'mild', plus: 3, minus: 2},
    {name: 'bashful', plus: 3, minus: 3},
    {name: 'rash', plus: 3, minus: 4},
    {name: 'quiet', plus: 3, minus: 5},
    {name: 'smart', plus: 3, minus: 6},

    {name: 'rebelious', plus: 4, minus: 0},
    {name: 'calm', plus: 4, minus: 1},
    {name: 'gentle', plus: 4, minus: 2},
    {name: 'careful', plus: 4, minus: 3},
    {name: 'quirky', plus: 4, minus: 4},
    {name: 'sassy', plus: 4, minus: 5},
    {name: 'depressed', plus: 4, minus: 6},

    {name: 'athletic', plus: 5, minus: 0},
    {name: 'timid', plus: 5, minus: 1},
    {name: 'hasty', plus: 5, minus: 2},
    {name: 'jolly', plus: 5, minus: 3},
    {name: 'naive', plus: 5, minus: 4},
    {name: 'serious', plus: 5, minus: 5},
    {name: 'fast', plus: 5, minus: 6},

    {name: 'optimist', plus: 6, minus: 0},
    {name: 'nice', plus: 6, minus: 1},
    {name: 'silly', plus: 6, minus: 2},
    {name: 'wary', plus: 6, minus: 3},
    {name: 'adventurer', plus: 6, minus: 4},
    {name: 'visionary', plus: 6, minus: 5},
    {name: 'gritty', plus: 6, minus: 6}
]

module.exports = async (message, client, con) => 
{
    try
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
        });

        if(message.content.toLocaleLowerCase().startsWith('bwe') && message.content.toLocaleLowerCase() != 'bwe!')
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

        let index = client.bwe.creatingCharacter.find(message.author.id);
        if(index > -1)
        {
            let progress = client.bwe.creatingCharacter.theList[index];
            if(progress.channel != message.channel.id){return}
            if(message.content.toLowerCase() == 'cancel')
            {
                console.log(TEXTS);
                client.bwe.creatingCharacter.delete(message.author.id);
                message.channel.send(TEXTS.stop);
                return;
            }

            let additionalText = '';
            let error = 0;
            switch(progress.step)
            {
                case 0:
                {
                    if(getPokemonNumberByName(message.content) > -1 || (!isNaN(message.content * 1) && message.content * 1 > 0 && message.content * 1 < POKEMON.list.length))
                    {
                        const pokemon = isNaN(message.content * 1) ? message.content.toLowerCase() : POKEMON.list[message.content * 1 - 1][0];
                        progress.data = {pokemon: pokemon};
                        if(POKEMON.forms[getPokemonNumberByName(pokemon) + 1] == undefined)
                        {
                            progress.data.form = 'regular';
                            progress.step = 2;
                        }
                        else
                        {
                            additionalText = 'forms';
                            progress.step = 1;
                        }
                    }
                    else{error = 1;}
                } 
                break;
                case 1:
                {
                    if(POKEMON.forms[getPokemonNumberByName(progress.data.pokemon) + 1][message.content.toLowerCase()] || message.content.toLowerCase() == 'regular')
                    {
                        progress.data.form = message.content.toLowerCase();
                        progress.step = 2;
                    }
                    else
                    {
                        additionalText = 'forms';
                        error = 2;
                    }
                } 
                break;
                case 2:
                {
                    switch(message.content.toLowerCase())
                    {
                        case 'm': case 'male': progress.data.gender = 'm'; break;
                        case 'f': case 'female': progress.data.gender = 'f'; break;
                        case 'n': case 'agender': case 'genderless': case 'no gender': progress.data.gender = 'n'; break;
                        
                        default: progress.data.gender = 'u';
                    }
                    if(progress.data.gender == 'u'){error = 3;}else{progress.step = 3;}
                } 
                break;
                case 3:
                    if(message.content.length > 20){error = 4;}
                    else
                    {
                        progress.data.nickname = message.content;
                        progress.step = 4;
                    }
                break;
                case 4:
                    if(message.attachments.firstKey())
                    {
                        let img = null;
                        const end = message.attachments.first().url.slice(-4);
                        if(end == '.jpg' || end == 'jpeg' || end == '.gif' || end == '.png' || end == '.bmp')
                        {
                            const theMSG = await client.channels.cache.get('992854842932473967').send({files: [message.attachments.first().url]});
                            img = theMSG.attachments.first().url;
                        }
                        if(img)
                        {
                            progress.data.img = img;
                            progress.step = 5;
                        }
                        else{error = 5;}
                    }
                    else{error = 5;}
                break;
                case 5:
                    const points = message.content.split(' ');
                    if(points.length == 7)
                    {
                        let sum = 0;
                        for(let i = 0; i < 7; i++){sum += points[i] * 1;}
                        if(sum == 35)
                        {
                            progress.stats = [];
                            progress.nature = {plus: [], minus:[]};
                            for(let i = 0; i < 7; i++)
                            {
                                progress.stats[i] = points[i];
                                progress.nature.plus[i] = 0;
                                progress.nature.minus[i] = 0;
                            }
                            progress.questions = [Math.floor(Math.random() * QUESTIONS.length)];
                            additionalText = 'question';
                            progress.step = 6;
                        }
                        else{error = 6;}        
                    }
                    else{error = 7;}
                break;
                case 6:
                    const answer = message.content * 1
                    additionalText = 'question';
                    if(!isNaN(answer) && answer > 0 && answer < 5)
                    {
                        const numOfQuestions = progress.questions.length;
                        for(let i = 0; i < 2; i++)
                        {
                            switch(QUESTIONS[progress.questions[numOfQuestions - 1]].answers[answer - 1].changes[i])
                            {
                                case '+hp': progress.nature.plus[0]++; break;
                                case '-hp': progress.nature.minus[0]++; break;
                                case '+attack': progress.nature.plus[1]++; break;
                                case '-attack': progress.nature.minus[1]++; break;
                                case '+defence': progress.nature.plus[2]++; break;
                                case '-defence': progress.nature.minus[2]++; break;
                                case '+sp.atk': progress.nature.plus[3]++; break;
                                case '-sp.atk': progress.nature.minus[3]++; break;
                                case '+sp.def': progress.nature.plus[4]++; break;
                                case '-sp.def': progress.nature.minus[4]++; break;
                                case '+speed': progress.nature.plus[5]++; break;
                                case '-speed': progress.nature.minus[5]++; break;
                                case '+luck': progress.nature.plus[6]++; break;
                                case '-luck': progress.nature.minus[6]++; break;
                            }
                        }
                        if(numOfQuestions == 8)
                        {
                            const maxPlus = Math.max(...progress.nature.plus);
                            const maxMinus = Math.max(...progress.nature.minus);
                            for(let i = 0; i < NATURES.length; i++)
                            {
                                if(NATURES[i].plus == progress.nature.plus.indexOf(maxPlus) && NATURES[i].minus == progress.nature.minus.indexOf(maxMinus))
                                {
                                    progress.data.nature = NATURES[i].name;
                                }
                            }
                            additionalText = '';
                            progress.step = 7;
                        }
                        else
                        {
                            let loop = true;
                            let newQuestion;
                            while(loop)
                            {
                                loop = false;
                                newQuestion = Math.floor(Math.random() * QUESTIONS.length);
                                for(let i = 0; i < numOfQuestions; i++)
                                {
                                    if(progress.questions[i] == newQuestion){loop = true;}
                                }
                            }
                            progress.questions[numOfQuestions] = newQuestion;
                        }
                    }
                break;
            }
            await client.bwe.deleteMessage(message);
            
            let embedFields = [];
            if(progress.data)
            {
                if(progress.data.pokemon){embedFields.push({name: 'specie', value: progress.data.pokemon, inline: true});}
                if(progress.data.form){embedFields.push({name: 'form', value: progress.data.form, inline: true});}
                if(progress.data.gender == 'm'){embedFields.push({name: 'gender', value: 'male', inline: true});}
                if(progress.data.gender == 'f'){embedFields.push({name: 'gender', value: 'female', inline: true});}
                if(progress.data.gender == 'n'){embedFields.push({name: 'gender', value: 'none', inline: true});}
                if(progress.data.nickname){embedFields.push({name: 'nickname', value: progress.data.nickname, inline: true});}
                if(progress.data.nature){embedFields.push({name: 'nature', value: progress.data.nature, inline: true});}
            }
            
            switch(additionalText)
            {
                case 'forms':
                    let forms = '';
                    for(const [key, value] of Object.entries(POKEMON.forms[getPokemonNumberByName(progress.data.pokemon) + 1]))
                    {
                        forms += ', ' + key;
                    }
                    additionalText = forms + '.';
                break;
                case 'question':
                    const questionNum = progress.questions.length;
                    const theQuestion = progress.questions[questionNum - 1];
                    additionalText = questionNum + ':\n' + QUESTIONS[theQuestion].question;
                    for(let i = 0; i < 4; i++)
                    {
                        additionalText += '\n' + (i + 1) + ')' + QUESTIONS[theQuestion].answers[i].text;
                    }
                    additionalText += '\n\nAnswer with number 1 - 4';
                break;
            }
            if(error){error = TEXTS.errors[error - 1];}else{error = '';}
            
            const embed = new MessageEmbed().setColor(client.bwe.AzorDefaultColor).setTitle('Creating pokemon character for da Game:')
            .setAuthor({name: message.member.displayName, iconURL: message.member.displayAvatarURL()})
            .setDescription('Step ' + progress.step + ': ' + TEXTS.steps[progress.step] + additionalText);
            if(progress.data)
            {
                embed.addFields(embedFields);
                if(progress.data.img){embed.setThumbnail(progress.data.img);}
            }
            if(error){embed.setFooter(error);}
            
            progress.message.edit({embeds: [embed]});
        }
    }
    catch(error){client.bwe.theError(error, {message: message}, null)}
}