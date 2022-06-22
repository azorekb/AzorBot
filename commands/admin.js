module.exports = async (aMessage, client, con) => //no slash
{
    try
    {
        let arguments = aMessage.arguments;
        let message = aMessage.message;
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
                                message.channel.send('to few arguments');
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
    }
    catch(error){client.bwe.theError(error, aMessage, null)}
    
        
}
    
    
            
                            
                            