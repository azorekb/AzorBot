const EMOJIS = require('../jsony/emoji.json');
const math = require('mathjs');
function changeCalculationString(string)
{
    string = string.replace(/:/g, '/');
    string = string.replace(/÷/g, '/');
    string = string.replace(/ęć/g, '5-pi');
    string = string.replace(/π/g, 'pi');
    string = string.replace(/x/g, '*');
    string = string.replace(/√/g, 'sqrt');
    return string;
}

module.exports = async (message, arguments, client, con, interaction = null) => 
{
    const theArgument = interaction ? interaction.options.getString('calculation') : arguments.join('');
    const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return message.channel.send(stuffs);}}

    try
    {
        if(theArgument == undefined){reply('tell me what to calculate. ' + EMOJIS.sip); return false;}
        let text = changeCalculationString(theArgument);
        if(text.indexOf('=') >= 0){reply('i can\'t calculate equations ' + EMOJIS.please); return false;}
        if(text == '2+2*2'){reply('8 ' + EMOJIS.run + ' ||jk 6||'); return false;}
        if(text == '9+10'){reply('21 ' + EMOJIS.think + ' ||jk 19||'); return false;}
        if(text == '0/0'){reply('<a:AzorExplode:982055237378519081>'); return false;}
        
        if(text.indexOf('±') > -1 || text.indexOf('∓') > -1)
        {
            let texts = [text,text];
            texts[0] = texts[0].replace(/±/g, '+');
            texts[0] = texts[0].replace(/∓/g, '-');
            texts[1] = texts[1].replace(/±/g, '-');
            texts[1] = texts[1].replace(/∓/g, '+');
            text = '';
            for(let i = 0; i < 2; i++)
            {
                text += (i + 1) + ': ';
                const node = math.parse(texts[i]);
                const calculation = math.evaluate(node.toString());
                if(calculation == Infinity){text += '<a:FA_Sparkles:977507221166518322> **INFINITY** <a:FA_Sparkles:977507221166518322>';}
                else{text += calculation.toString();}
                text += '\n';
            }
            reply(text);
            return false;
        }
        
        const node = math.parse(text);
        const calculation = math.evaluate(node.toString());
        if(calculation == Infinity){reply('<a:FA_Sparkles:977507221166518322> **INFINITY** <a:FA_Sparkles:977507221166518322>'); return false;}
        reply(calculation.toString());
        
    }
    catch(e)
    {
        console.log(e);
        reply('Something isn\'t right ' + EMOJIS.hide);
    }
}