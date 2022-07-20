const { MessageEmbed } = require("discord.js");
const { MessageAttachment } = require("discord.js");

module.exports = async (aMessage, client, con, interaction = null) => 
{
    DEX = client.bwe.loadJson('pokedex').pokemon;
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
    const theArgument = interaction ? interaction.options.getString('nameornumber') : aMessage.arguments[0];
    const secondArgument = interaction ? interaction.options.getString('form')?.replace(' ', '-') : aMessage.arguments[2] ? aMessage.arguments[1] + '-' + aMessage.arguments[2] : aMessage.arguments[1];

    try
    {
        if(theArgument == null)
        {
            let count = 0;
            for(let i = 0; i < DEX.length; i++){if(DEX[i]){count++;}}
            reply('Number pokemon in Pokedex: ' + count + '/' + DEX.length + '\nwrite name of pokemon or number in pokedex to see more details');
            return
        }
        let pokemon = theArgument * 1 - 1;
        if(isNaN(pokemon)){for(let i = 0; i < DEX.length; i++){if(DEX[i]?.name.toLowerCase() == theArgument.toLowerCase()){pokemon = i;}}}
        if(isNaN(pokemon) || !DEX[pokemon])
        {
            reply('I don\'t have any info about that pokemon.');
            return
        }
        let formIndex = -1;
        if(secondArgument)
        {
            let nufound = true;
            for(let i = 0; i < DEX[pokemon].forms?.length; i++)
            {
                console.log(DEX[pokemon].forms[i].name +  '==' + secondArgument)
                if(DEX[pokemon].forms[i].name.replace(' ', '-') == secondArgument)
                {
                    nufound = false;
                    formIndex = i;
                }
            }
            if(nufound)
            {
                reply('Wrong form');
                return;
            }
        }
        const formText = secondArgument ? DEX[pokemon].name + '-' + secondArgument : DEX[pokemon].name;
        const attachment = new MessageAttachment('./img/pokedex/' + formText + '.jpg', 'att.jpg');
        let P_Types = DEX[pokemon].types[1] == '-' ? DEX[pokemon].types[0] : DEX[pokemon].types[0] + '/' + DEX[pokemon].types[1];
        if(secondArgument && DEX[pokemon].forms[formIndex].types){P_Types = DEX[pokemon].forms[formIndex].types[1] == '-' ? DEX[pokemon].forms[formIndex].types[0] : DEX[pokemon].forms[formIndex].types[0] + '/' + DEX[pokemon].forms[formIndex].types[1];}
        let P_Abilities = DEX[pokemon].abilities[0];
        for(let i = 1; i < DEX[pokemon].abilities.length; i++)
        {
            if(DEX[pokemon].abilities[i] != '-') P_Abilities += ', ' + DEX[pokemon].abilities[i];
        } 
        if(secondArgument && DEX[pokemon].forms[formIndex].abilities)
        {
            P_Abilities = DEX[pokemon].forms[formIndex].abilities[0];
            for(let i = 1; i < DEX[pokemon].forms[formIndex].abilities.length; i++)
            {
                if(DEX[pokemon].forms[formIndex].abilities[i] != '-') P_Abilities += ', ' + DEX[pokemon].forms[formIndex].abilities[i];
            } 
        }
        let P_EggGroups = DEX[pokemon].eggGroups?.[0];
        for(let i = 1; i < DEX[pokemon].eggGroups?.length; i++)
        {
            P_EggGroups += ', ' + DEX[pokemon].eggGroups[i];
        }
        let P_Evolutions = '';
        for(let i = 0; i < DEX[pokemon].evolutions?.length; i++)
        {
            P_Evolutions += DEX[pokemon].evolutions[i].specie + '\n';
        }
        let P_Forms = '';
        for(let i = 0; i < DEX[pokemon].forms?.length; i++)
        {
            P_Forms += DEX[pokemon].forms[i].name + '\n';
        }
        const HEIGHT = secondArgument && DEX[pokemon].forms[formIndex].height ? DEX[pokemon].forms[formIndex].height : DEX[pokemon].height;
        const WEIGHT = secondArgument && DEX[pokemon].forms[formIndex].weight ? DEX[pokemon].forms[formIndex].weight : DEX[pokemon].weight;
        const BASE_EXP = secondArgument && DEX[pokemon].forms[formIndex].baseExp ? DEX[pokemon].forms[formIndex].baseExp : DEX[pokemon].baseExp;
        const BASE_HP = secondArgument && DEX[pokemon].forms[formIndex].baseStats?.hp ? DEX[pokemon].forms[formIndex].baseStats?.hp : DEX[pokemon].baseStats?.hp;
        const BASE_AT = secondArgument && DEX[pokemon].forms[formIndex].baseStats?.attack ? DEX[pokemon].forms[formIndex].baseStats?.attack : DEX[pokemon].baseStats?.attack;
        const BASE_DF = secondArgument && DEX[pokemon].forms[formIndex].baseStats?.defence ? DEX[pokemon].forms[formIndex].baseStats?.defence : DEX[pokemon].baseStats?.defence;
        const BASE_SA = secondArgument && DEX[pokemon].forms[formIndex].baseStats?.spAtk ? DEX[pokemon].forms[formIndex].baseStats?.spAtk : DEX[pokemon].baseStats?.spAtk;
        const BASE_SD = secondArgument && DEX[pokemon].forms[formIndex].baseStats?.spDef ? DEX[pokemon].forms[formIndex].baseStats?.spDef : DEX[pokemon].baseStats?.spDef;
        const BASE_SP = secondArgument && DEX[pokemon].forms[formIndex].baseStats?.speed ? DEX[pokemon].forms[formIndex].baseStats?.speed : DEX[pokemon].baseStats?.speed;
        const DATA_NAMES = ['name', 'types', 'height', 'weight', 'abilities', 'catch rate', 'base friendship', 'base exp' , 'growth rate', 'egg groups', 'female rate', 'egg cycles', 'base hp', 'base attack', 'base defence', 'base special attack', 'base special defence', 'base speed', 'evolutions', 'forms'];
        const DATA_VALUES = [DEX[pokemon].name, P_Types, HEIGHT + 'm', WEIGHT + 'kg', P_Abilities, DEX[pokemon].catchRate, DEX[pokemon].friendship, BASE_EXP, DEX[pokemon].growthRate, P_EggGroups, DEX[pokemon].femaleRate + '%', DEX[pokemon].eggCycles,BASE_HP,BASE_AT,BASE_DF,BASE_SA,BASE_SD,BASE_SP,P_Evolutions,P_Forms];

        const FIELDS = [];
        for(let i = 0; i < DATA_NAMES.length; i++)
        {
            if(DATA_VALUES[i])
            {
                FIELDS.push({name: DATA_NAMES[i], value: '' + DATA_VALUES[i], inline: true})
            }
        }
        
        const embed = new MessageEmbed().setColor(client.bwe.AzorDefaultColor)
        .setTitle('Pokedex info about No. ' + (pokemon + 1))
        .setThumbnail('attachment://att.jpg')
        .setFields(FIELDS);
        reply({embeds: [embed], files: [attachment]});
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}