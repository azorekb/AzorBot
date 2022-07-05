const EMOJIS = require('./jsony/emoji.json');
const POKEMON = require('./jsony/pokemon.json');
const getPokemonNumberByName = (_name) =>
{
    for(let i = 0; i < POKEMON.list.length; i++)
    {
        if(POKEMON.list[i][0].toLowerCase() == _name.toLowerCase()){return i;}
    }

    return -1;
}
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
            if(message.content == 'cancel')
            {
                client.bwe.creatingCharacter.delete(message.author.id);
                message.channel.send('Creating stop');
            }
            if(progress.channel == message.channel.id && message.content != 'cancel')
            {
                let img = null;
                if(progress.step == 4 && message.attachments.firstKey())
                {
                    console.log(2);
                    const end = message.attachments.first().url.slice(-4);
                    if(end == '.jpg' || end == 'jpeg' || end == '.gif' || end == '.png' || end == '.bmp')
                    {
                        const theMSG = await client.channels.cache.get('992854842932473967').send({files: [message.attachments.first().url]});
                        img = theMSG.attachments.first().url;
                    }
                }
                await client.bwe.deleteMessage(message);
                let pokemonDispaly = 'Pokemon: ';
                if(progress.data)
                {
                    if(progress.data.nickname){pokemonDispaly += progress.data.nickname + ' the ';}
                    if(progress.data.pokemon){pokemonDispaly += progress.data.pokemon;}
                    if(progress.data.gender == 'm'){pokemonDispaly += ' :male_sign:';}
                    if(progress.data.gender == 'f'){pokemonDispaly += ' :female_sign:';}
                }
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
                                progress.message.edit(pokemonDispaly + '\n\nPlease choose your gender:\nM - male, F - female, N - no gender');
                                progress.step = 2;
                            }
                            else
                            {
                                let forms = '';
                                for(const [key, value] of Object.entries(POKEMON.forms[getPokemonNumberByName(pokemon) + 1]))
                                {
                                    forms += ', ' + key;
                                }
                                progress.message.edit(pokemonDispaly + '\n\nPlease choose your form: regular' + forms);
                                progress.step = 1;
                            }
                        }
                        else
                        {
                            progress.message.edit('Please choose your specie. Write name of pokemon or number in pokedex.\n\nWrong number or name')
                        }
                    } 
                    break;
                    case 1:
                    {
                        if(POKEMON.forms[getPokemonNumberByName(progress.data.pokemon) + 1][message.content.toLowerCase()] || message.content.toLowerCase() == 'regular')
                        {
                            progress.data.form = message.content.toLowerCase();
                            const pokemon = progress.data.form == 'regular' ? progress.data.pokemon : progress.data.form + ' ' + pokemonDispaly;
                            progress.message.edit('Pokemon: ' + pokemon + '\n\nPlease choose your gender:\nM - male, F - female, N - no gender');
                            progress.step = 2;
                        }
                        else
                        {
                            let forms = '';
                                for(const [key, value] of Object.entries(POKEMON.forms[getPokemonNumberByName(progress.data.pokemon) + 1]))
                                {
                                    forms += ', ' + key;
                                }
                            progress.message.edit(pokemonDispaly + '\n\nPlease choose your form: regular' + forms + '\n\nWrong form, try again.')
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
                        if(progress.data.gender == 'u')
                        {
                            progress.message.edit(pokemonDispaly + '\n\nPlease choose your gender:\nM - male, F - female, N - no gender\n\nwrong gender, try again');
                        }
                        else
                        {
                            const gender = progress.data.gender == 'm' ? ' :male_sign:' : progress.data.gender == 'f' ? ' :female_sign:' : '';
                            progress.message.edit(pokemonDispaly + gender + '\n\nwrite your nickname (please don\'t use any custom character, cus there could be a problem with dispaly it) max 20 characters');
                            progress.step = 3;
                        }
                    } 
                    break;
                    case 3:
                        if(message.content.length > 20)
                        {
                            progress.message.edit(pokemonDispaly + gender + '\n\nwrite your nickname (please don\'t use any custom character, cus there could be a problem with dispaly it) max 20 characters\n\nNickname is too long, please try include it in 20 characters max');
                        }
                        else
                        {
                            progress.data.nickname = message.content;
                            const nickname = progress.data.nickname + ' the ';
                            progress.message.edit(nickname + pokemonDispaly + '\n\nSend your pfp here.');
                            progress.step = 4;
                        }
                    break;
                    case 4:
                        if(img)
                        {
                            progress.data.img = img;
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
                        else
                        {
                            progress.message.edit(pokemonDispaly + '\n\nSend your pfp here.\n\nno image in message');
                        }
                    break;
                }
            }
        }
    }
    catch(error){client.bwe.theError(error, {message: message}, null)}
}