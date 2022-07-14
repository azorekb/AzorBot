const { MessageEmbed } = require('discord.js');

module.exports = async (aMessage, client, con, interaction = null) => 
{
    const QUESTIONS = client.bwe.loadJson('questions').list;
    const TEXTS = client.bwe.loadJson('texts').newCharacter;
    const reply = (stuffs) => {if(interaction){return interaction.channel.send(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
    const theArgument = interaction ? interaction.options.getString('language').toLowerCase() : aMessage.arguments[0].toLowerCase();

    try
    {
        const limit = 50;
        const checkForJob = (file, text, jobs) =>
        {
            for(const [key, value] of Object.entries(file))
            {
                if(jobs < limit)
                {
                    if(Array.isArray(value))
                    {
                        for(let i = 0; i < value.length; i++)
                        {
                            if(jobs < limit)
                            {
                                if(value[i].polski && !value[i][theArgument])
                                {
                                    text += (1 + jobs++) + ') ' + value[i].english + '\n';
                                }
                            }
                        }
                    }
                    else
                    {
                        if(value.polski && !value[theArgument])
                        {
                            text += (1 + jobs++) + ') ' + value.english + '\n';
                        }
                    }
                }
            }

            return [text, jobs];
        }

        const language = ['deutsch', 'espanol', 'francais', 'italiano'];
        if(language.indexOf(theArgument) > -1)
        {
            let jobs = 0;
            let text = '';
            
            [text, jobs] = checkForJob(TEXTS, text, jobs);
            for(let i = 0; i < QUESTIONS.length; i++)
            {
                [text, jobs] = checkForJob(QUESTIONS[i], text, jobs);
            }

            const embed = new MessageEmbed().setTitle('Translation Job for ' + theArgument)
            .setDescription('List of texts to translate (max ' + limit + ' for once):\n' + text);

            if(jobs){reply({embeds: [embed]});}
            else{reply('Everything is translated so far. Wait for new texts');}
        }
        else
        {
            reply('There is no language ' + theArgument + ' on my list (or you wrote it incorrect)\nList of languages: deutsch, espanol, francais, italiano');
        }
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}