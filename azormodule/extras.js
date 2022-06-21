const NAMES = require('../jsony/names.json');
const EMOJIS = require('../jsony/emoji.json');
function tellName(_message)
{
    
    let id = _message.author.id;
    for(let i = 0; i < NAMES.names.length; i++)
    {
        if(NAMES.names[i].id == id){return NAMES.names[i].name}
    }

    return _message.member.displayName;
}

module.exports = async (aMessage, client, con) => 
{
    const message = aMessage.message;
    const arguments = aMessage.arguments;
    try
    {
        switch(aMessage.command.toLowerCase())
        {
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
                }
                else{return true;}
            break;
            case 'do': case 'don\'t': case 'what': case 'you': case 'shut': case 'prepare': case 'how': case 'be':
            {
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
                    default: return true;
                }
                // <@!951074944660410400>
            } break;
            
            default: return true;
        }
    
        return false;
    }
    catch(error)
    {
        message.channel.send('Some error happened. ' + EMOJIS.blush);
        client.channels.cache.get('946830760839610460').send('error: ' + error);
        console.log(error);  
    }
}