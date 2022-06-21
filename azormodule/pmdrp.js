const POKEMON_TYPES = require('../jsony/pokemontypes.json');
const EMOJIS = require('../jsony/emoji.json');
const DATA = require('../data.json');

let map = [
    [3,18,24,13,18,20,19,29],
    [31,18,25,22,18,25,23,5],
    [19,20,23,24,29,23,25,0],
    [30,17,17,22,29,30,22,20],
    [19,26,26,20,19,6,18,25],
    [23,20,10,21,17,0,2,30],
    [22,21,17,19,21,31,27,29],
    [3,18,26,26,18,18,21,1],
]

let mapElements = 
[
    '<:000:934896972308029490>',
    '<:001:934894604409503784>',
    '<:002:934894604409511986>',
    '<:003:934894604422115400>',
    '<:004:934894604472442911>',
    '<:005:934894604631826564>',
    '<:006:934894604547915837>',
    '<:007:934894604652777504>',
    '<:008:934894604703109140>',
    '<:009:934894604526944266>',
    '<:010:934894604451475577>',
    '<:011:934894604384337931>',
    '<:012:934894604564717668>',
    '<:013:934894604321439836>',
    '<:014:934894604652785724>',
    '<:015:934894604661194772>',
    '<:016:934894604602458192>',
    '<:017:934894604438884393>',
    '<:018:934894605013508146>',
    '<:019:934894604304658524>',
    '<:020:934894604686356491>',
    '<:021:934894604711501915>',
    '<:022:934894604338200627>',
    '<:023:934894604703105035>',
    '<:024:934894604401135647>',
    '<:025:934894604992532530>',
    '<:026:934894604694745168>',
    '<:027:934894604719910922>',
    '<:028:934901491381190786>',
    '<:029:934901491406356520>',
    '<:030:934901491460870234>',
    '<:031:934901491452477451>'
]

function getPokemonNumberByName(_name, pokemonList)
{
    for(let i = 0; i < pokemonList.length; i++)
    {
        if(pokemonList[i].name == _name){return i;}
    }

    return -1;
}

module.exports = async (aMessage, client, con) => 
{
    pokemonList = client.bwe.pokemonList;
    const message = aMessage.message;
    let arguments = aMessage.arguments; 
    switch(aMessage.command)
    {
        case 'start':
            if(!client.bwe.isItTester(message)) 
            {
                message.channel.send('Sorry, you must be tester to use this command.');
                return false;
            }

            if(arguments.length == 10 || arguments.length == 11)
            {
                const _nickname = arguments[0];
                const _specie = arguments[1];
                _gender = arguments[2];
                const _ability = arguments[3];
                const _IV = [arguments[4],arguments[5],arguments[6],arguments[7], arguments[8], arguments[9]];
                const _confirm = arguments[10] ? arguments[10] : '';
                
                const SERVER_ID = message.guild.id;
                let allIsOk = true;
                
                let error = 'Errors:';
                if(_nickname.length < 1){error += '\nNickname is too short'; allIsOk = false;}
                if(_nickname.length > 30){error += '\nNickname is too long'; allIsOk = false;}
                PKMN = getPokemonNumberByName(_specie, pokemonList);
                if(PKMN == -1){error += '\ni don\'t have that pokemon in my database'; allIsOk = false;}
                else if(pokemonList[PKMN].abilities[0] != _ability && pokemonList[PKMN].abilities[1] != _ability){error += '\nthat pokemon can\'t have that ability'; allIsOk = false;}
                switch(_gender.toLowerCase())
                {
                    case 'f': case 'female': case 'girl': case 'woman': case 'she': case 'her': case 'lady': case 'princess': _gender = 'F'; break;
                    case 'm': case 'male': case 'boy': case 'man': case 'he': case 'him': case 'his': case 'gentleman': case 'prince': _gender = 'M'; break;
                    case 'n': case 'no': case 'non': case 'genderless': case 'without': _gender = 'N'; break;
                    default: error += '\nthis gender isn\'t available'; allIsOk = false;
                }
                let sumIV = 0;
                let IVtext = '';
                for(let i = 0; i < _IV.length; i++)
                {
                    if(isNaN(_IV[i] * 1)){error += '\none of IV is not a number'; allIsOk = false;}
                    else
                    {
                        if(_IV[i] * 1 > 5){error += '\none of IV is too high'; allIsOk = false;}
                        if(_IV[i] * 1 < 0){error += '\none of IV is too low'; allIsOk = false;}
                        
                    } 
                    
                    if(i > 0){IVtext += ',';}
                    IVtext += _IV[i];
                    sumIV += _IV[i] * 1;
                }
                if(!isNaN(sumIV))
                {
                    if(sumIV > 12 && allIsOk){error += '\nSum of IV\'s are too big'; allIsOk = false;}
                    if(sumIV < 12 && allIsOk && _confirm != 'sure'){error += '\nSum of IV\'s are too low, but if you want to play with lower IV write "sure" as the last argument'; allIsOk = false;}
                }
                
                if(allIsOk)
                {
                    con.query('select id from players where user = ' + message.author.id + ' and server = ' + SERVER_ID, (err, row) => 
                    {
                        if(err == null)
                        {
                            if(row.length == 0)
                            {
                                con.query('insert into players (name, specie, gender, IV, ability, user, server) values ("' + _nickname + '","' + _specie + '","' + _gender + '","' + IVtext + '","' + _ability + '","' + message.author.id + '" + "' + SERVER_ID + '")', (error,rows) =>
                                {
                                    if(error == null)
                                    {
                                        message.channel.send('Success! [a very nice text welcoming a person or something]');
                                    }
                                    else
                                    {
                                        message.channel.send('error:\n' + error);
                                    }
                                });
                            }
                            else
                            {
                                message.channel.send('You already have account on this server. [here will be info how to delete account]');
                            }
                        }
                        else
                        {
                            message.channel.send('You already have account. [here will be info how to delete account]');
                        }
                    });
                }
                else
                {
                    message.channel.send(error);
                }
                
            }
            else
            {
                message.channel.send('number of arguments are wrong\nusage: start [nickname] [pokemon] [gender] [ability] [IV]\nnickname: 1-30 characters, replace space with _\npokemon: make sure if it\'s available\ngender: F - Female, M - Male, N - No gender (genderless)\nability: choose one of available ability of your pokemon\nIV (individual value): write 6 numbers separating them with space in order: HP, attack, defence, special attack, special defence, speed. max 5 per stat and max 12 at sum\nexample:\n' + DATA.prefix + 'start Azor umbreon M synchronize 2 5 3 0 1 1');
            }
        break;
        case 'pokedex':
            if(arguments[0] == undefined)
            {
                // text = 'Pokemon in my Pokedex:\n' + pokemonList[0].name;
                // for(let i = 1; i < pokemonList.length; i++)
                // {
                //     text += ', ' + pokemonList[i].name;
                // }
                // message.channel.send(text);
                message.channel.send('Number of pokemon in pokedex: ' + pokemonList.length);
            }
            else
            {
                const PKMN = getPokemonNumberByName(arguments[0], pokemonList);
                if(PKMN == -1)
                {
                    message.channel.send('there is no pokemon with name ' + arguments[0] + ' in my database.')
                }
                else
                {
                    const pokemon = pokemonList[PKMN];
                    message.channel.send('**' + pokemon.name + '**\nTypes: ' + POKEMON_TYPES[pokemon.types[0]].english + '/' +  POKEMON_TYPES[pokemon.types[1]].english + '\nAbilities: ' + pokemon.abilities + '\nBase HP: ' + pokemon.hp + '\nBase Attack: ' + pokemon.attack + '\nBase Defence: ' + pokemon.defence + '\nBase Special Attack: ' + pokemon.spAttack + '\nBase Special Defence: ' + pokemon.spDefence + '\nBase Speed: ' + pokemon.speed + '\nFemale Rate: ' + pokemon.femaleChance + '%');
                }
            }
        break;
        case 'map':
            let snow = 0;
            text = '';
            for(let itrain = 0; itrain < 2; itrain++)
            for(let i = 0; i < 8; i++)
            {
                for(let itsnow = 0; itsnow < 2; itsnow++)
                {

                    for(let j = 0; j < 8; j++)
                    {
                        text += mapElements[map[i][j]];
                    }
                }
                
                if(snow == 3)
                {
                    snow = 0;
                    message.channel.send(text);
                    text = '';
                }
                else
                {
                    text += '\n';
                    snow++;
                }
            }
        break;
        case 'createteam':
            if(!isItAdminorTester) 
            {
                message.channel.send('Sorry, you must be tester to use this command.');
                return false;
            }
            con.query('select id from players where server = "' + message.guild.id + '" and user = "' + message.author.id + '"', (err, row) =>
            {
                if(err == null)
                {
                    if(row.length == 0)
                    {
                        message.channel.send('You don\'t have character here yet. ' + EMOJIS.hide);
                    }
                    else
                    {
                        if(arguments[0] == undefined)
                        {

                        }
                        else if(arguments[1] == undefined)
                        {

                        }
                        else
                        {

                        }
                    }
                }
                else
                {
                    message.channel.send('error: ' + err)
                }
            });
        break;

        default: return true;
    }

    return false;
}