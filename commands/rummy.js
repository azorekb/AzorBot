const { map } = require("mathjs");

module.exports = async (message, arguments, client, con, interaction = null) => 
{
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return message.channel.send(stuffs);}}
    let theArgument = interaction ? interaction.options.getString('argument') : arguments[0];
    const author = interaction ? interaction.member : message.author;
    
    switch(theArgument)
    {
        case 'info': reply('**Deck of cards**: A, 2, 3, 4, 5, 6, 7, 8, 9, 10, J, Q, K, Joker\n**Minimum number of decks**: 1 for every 2 players\n**Maximum number of players**: 8\n\nRules will be added later.'); break;
        case 'start':
        {
            let players = [{id: author.id, name: author.username}];
            let isBot = false;
            let outsidePlayer = false;
            let playerInGame = false;
            console.log(message.mentions);
            message.mentions.users.forEach(element => 
            {
                if(element.bot){isBot = true;}
                else if(client.bwe.rummy.find(element.id, message.guildId) > -1)
                    playerInGame = true;
                else if(element.id != author.id)
                    players[players.length] = {id: element.id, name: element.username};
            });
            if(isBot)
                return reply('Bot can\'t be a player');
            if(outsidePlayer)
                return reply('you mentioned user who\'s not in the server');
            if(playerInGame)
                return reply('at least one player is already in the game in the server');
            if(message.mentions.users.size == 0)
                return reply('Please mention players who will play with you.');
            if(players.length == 1)
                return reply('Minimum number of players is 2');
            if(players.length > 8)
                return reply('Maximum number of players is 8');

            reply('Players: ' + players.map(el => el.name).join(', '));
            let category = message.guild.channels.cache.find(channel => channel.name === 'azorbot-rummy' && channel.type == 'GUILD_CATEGORY');
            if(category == undefined)
            {
                message.guild.channels.create('azorbot-rummy', {type: 'GUILD_CATEGORY' })
                category = message.guild.channels.cache.find(channel => channel.name === 'azorbot-rummy' && channel.type == 'GUILD_CATEGORY');
            }


        }
        break;
        // case 'test':
        //     console.log(message.guild.channels.cache.find(channel => channel.name === 'azor-rummy' && channel.type == 'GUILD_CATEGORY'));
        // break;

        default: reply('available arguments: info, start');
    }

}
