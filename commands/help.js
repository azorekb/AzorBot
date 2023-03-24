const { MessageEmbed } = require('discord.js');
const DATA = require('../data.json');
const EMOJIS = require('../jsony/emoji.json');

module.exports = async (message, arguments, client, con, interaction = null) =>
{
    try
    {
        let theArgument = interaction ? interaction.options.getString('command') : arguments[0];
    
        let embed = new MessageEmbed().setColor(client.bwe.AzorDefaultColor);
        if(theArgument == null)
        {
            embed.setTitle('Available commands:')
            .addFields
            (
                {name: DATA.prefix + 'help', value: 'showing commands', inline: true},
                {name: DATA.prefix + 'OC', value: 'send pic of Fairy\'s or Szibi\'s OC', inline: true},
                {name: DATA.prefix + 'pic', value: 'send one of my pictures or pokemon i collected', inline: true},
                {name: DATA.prefix + 'admin', value: 'admin stuffs (not server admin, bot admin)', inline: true},
                // {name: 'Moderation stuffs:', value: 'need to be server admin to use'},
                {name: DATA.prefix + 'welcomechannel', value: 'set "welcome and goodbye" channel', inline: true},
                
                // {name: 'RP test commands:', value: 'those who require being tester is writed with **bold**'},
                {name: DATA.prefix + 'start', value: 'create account on RP', inline: true},
                {name: DATA.prefix + 'pokedex', value: 'show data about pokemon', inline: true},
                // {name: DATA.prefix + 'map', value: 'shows an example map', inline: true},
                // {name: DATA.prefix + '', value: '', inline: true},
                
                // {name:'Music commands:', value: '|'},
                {name: DATA.prefix + 'play', value: 'playing a song', inline: true},
                {name: DATA.prefix + 'skip', value: 'skip a song', inline: true},
                {name: DATA.prefix + 'queue', value: 'shows acctual queue and actives music panel', inline: true},
                {name: DATA.prefix + 'remove', value: 'removes a song from queue', inline: true},
                {name: DATA.prefix + 'playlist', value: 'set/edit/create playlist', inline: true},
                // {name: DATA.prefix + '', value: '', inline: true},
                {name: DATA.prefix + 'poll', value: 'creating simple poll', inline: true},
                {name: DATA.prefix + 'roll', value: 'send random integer', inline: true},
                {name: DATA.prefix + 'calculate', value: 'give you result of simple calculation', inline: true},
                {name: DATA.prefix + 'activelevel', value: 'actives leveling on server', inline: true},
                {name: DATA.prefix + 'level', value: 'shows actual level', inline: true},
                {name: DATA.prefix + 'connectchannel', value: 'connect channels with connect code', inline: true},
                
                {name: 'you can use command with mention: @AzorBot [COMMAND]', value: 'if you will see that any command doesn\'t work tell it to my Lord or Princess'}
                );
        }
        else
        {
            embed.setTitle('Command: ' + arguments[0]);
            switch(theArgument.toLowerCase())
            {
                case 'help': embed.setDescription('Well... i don\'t think you really need to know how to use help when you just used it right...' + EMOJIS.think); break;
                case 'welcomechannel': embed.setDescription('Set/check/change welcome channel (channel where message will be send when a new user comes into server or any user left the server)\n\n**Usage**:\n*to check*\nbwe!welcomeChannel\n*to set/change*\nbwe!welcomeChannel [mention a channel]'); break;
                case 'oc': embed.setDescription('Send a picture of one of OCs I have in my database\n\n**usage**:\n*to check the list of OCs*\nbwe!OC\n*to send one*\nbwe!OC [name of OC]\n*reactions on message*\n' + EMOJIS.left + ' previous picture\n' + EMOJIS.right + ' next picture\n' + EMOJIS.x + ' delete message'); break;
                case 'pic': embed.setDescription('Send a picture of one of pokemon I have in my database\n\n**usage**:\n*to check the list of pokemon*\nbwe!pic\n*to send one*\nbwe!pic [name of pokemon]\n*reactions on message*\n' + EMOJIS.left + ' previous picture\n' + EMOJIS.right + ' next picture\n' + EMOJIS.x + ' delete message'); break;
                case 'poll': embed.setDescription('Create a simple poll, when you can react to vote\n\n**usage**:\nbwe!poll [optional mention channel]\n(new line)[title/question of poll]\n(new line)[emoji] option name (minimum 2 options optional more, every option in new line)'); break;
                case 'nonsense': embed.setDescription('Counts days without nonsense, every use restart the counting\n\n**usage**:\nbwe!nonsense'); break;
                case 'roll': embed.setDescription('Send random integer number\n\n**usage**:\nbwe!roll [max number] [optional number of rolls in same time (default = 1) must be more than 0]'); break;
                case 'count': case 'calculate': embed.setDescription('Calculate simple calculation\n\n**usage**:\nbwe!calculate [calculation]\naddition: +\nsubtraction: -\nmultiplication: * x\ndivision: / : ÷\nexponentiation: ^\nroot: √([number]) sqrt([number])\nconstants: pi e i\nother: ± ∓'); break;
                case 'activelevel': embed.setDescription('Active leveling in server or change channel when info about level up will be sent\n\n**usage**:\nbwe!activelevel [optional mention channel]'); break;
                case 'level': embed.setDescription('Send picture what shows your actual level in the server\n\n**usage**:\nbwe!level'); break;
                case 'admin': embed.setDescription('This is **BOT** Admin stuffs (not server admin), but actually there isn\'t much to do, so... hehe um... i will go ' + EMOJIS.run); break;
                case 'test': embed.setDescription('This command is to test new stuffs. If something is necessary to test, but most of time it\'s useless command\n\n**usage**:\nbwe!test'); break;
                case 'connectchannel': embed.setDescription('Connect to web of channels. When you send message in one channel in the web, I will resend it to every channel in same web. Every web has own connection code\n\n**usage**:\nbwe!connectChannel [connection code 1 - 100 characters without space]'); break;
                case 'play': embed.setDescription('Play a song in VC and create interactive queue (you must be in the Voice Channel to use it)\n\n**usage**:\nbwe!play [name of song/YouTube video or link]\n*reactions on message*\n' + EMOJIS.pausePlay + ' pause/resume\n' + EMOJIS.shuffle + ' shuffle\n' + EMOJIS.up + ' increase volume 10%\n' + EMOJIS.down + ' decrease volume 10%\n' + EMOJIS.skip + ' skip a son\n' + EMOJIS.loop1 + ' set/unset loop on the song\n' + EMOJIS.loop2 + ' set/unset loop on the queue\n' + EMOJIS.stop + ' stop queue (queue message will be deleted)\nqueue message updates itself every 10s after last reaction or song added. user\'s message will be deleted (if I have permission)\nlinks with ready playlists still doesn\'t work'); break;
                case 'nowplaying': case 'queue': embed.setDescription('create new interactive queue, the previous one will become inactive\n\n**usage**:\nbwe!queue\n*reactions on message*\n' + EMOJIS.pausePlay + ' pause/resume\n' + EMOJIS.shuffle + ' shuffle\n' + EMOJIS.up + ' increase volume 10%\n' + EMOJIS.down + ' decrease volume 10%\n' + EMOJIS.skip + ' skip a son\n' + EMOJIS.loop1 + ' set/unset loop on the song\n' + EMOJIS.loop2 + ' set/unset loop on the queue\n' + EMOJIS.stop + ' stop queue (queue message will be deleted)\nqueue message updates itself every 10s after last reaction or song added. user\'s message will be deleted (if I have permission)'); break;
                case 'remove': embed.setDescription('delete song from queue (you must be in the Voice Channel to use it and there must be any song in queue)\n\n**usage**:\nbwe!remove [index of song you want to remove]'); break;
                case 'playlist': embed.setDescription('create/update/play/delete playlist saved in my database (you must be in Voice Channel to use it)\n\n**usage**:\n*to create*\nbwe!playlist create [name of playlist without space 1 - 50 characters]\n*to add song*\nbwe!playlist add [name of playlist] [name of song/YouTube video or link]\n(song will be added to actual queue as well)\n*to delete song from playlist*\nbwe!playlist delete song [playlist name] [index of song in playlist]\n*to delete playlist*\nbwe!playlist delete playlist [name of playlist]\n*to show list of playlists*\nbwe!playlist show\n*to show the list of songs of playlist*\nbwe!playlist show [name of playlist]\n*to play*\nbwe!playlist play [name of playlist]\n*to play all playlists that you created*\nbwe!playlist play it all\nyou can add/delete songs of playlist or delete playlist only when you created it'); break;
                case 'start': embed.setDescription('create account in PMD RP (you must be tester to use it)\n\n**usage**:\nbwe!start [nickname] [pokemon] [gender] [ability] [IV]\nnickname: 1-30 characters, replace space with _\npokemon: make sure if it\'s available\ngender: F - Female, M - Male, N - No gender (genderless)\nability: choose one of available ability of your pokemon\nIV (individual value): write 6 numbers separating them with space in order: HP, attack, defence, special attack, special defence, speed. max 5 per stat and max 12 at sum'); break;
                case 'pokedex': embed.setDescription('Show data about pokemon in my database\n\n**usage**:\nbwe!pokedex [name of pokemon]'); break;
                case 'map': embed.setDescription('Show example of map in PMD RP\n\n**usage**:\nbwe!map'); break;
                case 'createteam': embed.setDescription('this command isn\'t working... and i doubt it will so soon so... ||go motivate Erichu, maybe the game will run hehe||'); break;
            
                case 'hi': case 'hello': case 'goodmornig':case 'goodnight':  case 'apple': case 'orange': case 'strawberry': case 'tangerine': case 'banana': case 'watermelon': case 'blueberries': case 'melon': case 'cherries': case 'peach':
                    embed.setDescription('I think there is no need to explain how the command could work. It\'s still not official command so i can refuse to explain it hehe ' + EMOJIS.vibbing); break;
                        
                case 'rozmowa': case 'powiedz': case 'pdd': case 'stoptest': case 'wakeuperic':case 'wakeupszibi':case 'amiadmin':case 'commission':case 'do': case 'don\'t': case 'what': case 'you': case 'shut': case 'prepare': case 'how': case 'be':
                    embed.setDescription('well, it\'s one of hidden command, ye, um... i can\'t tell you how to use it, sorry... ' + EMOJIS.blush); break;
                            
                default: embed.setDescription('It seems like i don\'t have this command or the description isn\'t set yet  ' + EMOJIS.hide);
            }
        }
                       
        if(interaction) await interaction.reply({ embeds: [embed], ephemeral: true });
        else message.channel.send({ embeds: [embed], ephemeral: true });
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}