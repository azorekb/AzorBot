const { MessageEmbed } = require('discord.js');
const { MessageAttachment } = require('discord.js');
const Canvas = require('canvas');
module.exports = async (aMessage, client, con, interaction = null) => 
{
    const theArgument = interaction ? interaction.options.getInteger('bg') : aMessage.arguments[0] * 1;
    const channel = interaction ? interaction.channel : aMessage.message.channel;
    const EMOJIS = client.bwe.loadJson('emoji');
    const author = interaction ? interaction.member.id : aMessage.message.author.id;
    const POKEDEX = client.bwe.loadJson('pokedex');

    try
    {
        if(interaction)
        {
            interaction.deferReply();
            interaction.deleteReply();
        }
        const theMessage = await channel.send(EMOJIS.lagging);
        
        if(client.bwe.battle.find(author) > -1){return channel.send('You must first finish previous test');}
        con.query('select * from players where user = "' + author + '";', async (error, rows) =>
        {
            if(error)
            {
                theMessage.edit('error: ' + error);
                return;
            }
            if(rows.lenght == 0)
            {
                await theMessage.edit('You have no character in da game. ' + EMOJIS.sip);
                return;
            }
            const timeStart = new Date().getTime();

            progressCount = 17;
            await theMessage.edit('0/' + progressCount + ' ' + EMOJIS.lagging);

            let background = theArgument ? theArgument : Math.ceil(Math.random() * 4);
            switch(background)
            {
                case 2: background = 'bg_sunset.png'; break;
                case 3: background = 'bg_night.png'; break;
                case 4: background = 'bg_rain.png'; break;
        
                default: background = 'bg_day.png';
            }
        
            const canvas = Canvas.createCanvas(641, 826);
            const context = canvas.getContext('2d');
            const BGIMG = await Canvas.loadImage('./img/battle/' + background);
            context.drawImage(BGIMG, 0, 0);
            await  theMessage.edit('1/' + progressCount + ' ' + EMOJIS.lagging);
            const stuffs = await Canvas.loadImage('./img/battle/elements.png');
            context.drawImage(stuffs, 0, 0);
            await theMessage.edit('2/' + progressCount + ' ' + EMOJIS.lagging);
            const PFP = await Canvas.loadImage(rows[0].imgURL);
            context.drawImage(PFP, 31, 550, 100, 100);
            context.drawImage(PFP, 553, 561, 34, 35);
            await theMessage.edit('3/' + progressCount + ' ' + EMOJIS.lagging);

            context.font = 'bold 15px comic Sans MS';
            context.fillStyle = '#080';
            context.fillText(rows[0].name, 468, 578);
            context.fillText('The ' + rows[0].specie, 468, 600);
            
            for(let i = 0; i< 4; i++)
            {
                const move = Math.floor(Math.random() * POKEDEX.moves.length);
                context.fillText(POKEDEX.moves[move].name, 480, 657 + 32 * i);
            }
            

            let count = 0;
            for(let i = 0; i < POKEDEX.pokemon.length; i++){if(POKEDEX.pokemon[i]){count++;}}
            const opponent_num = Math.random() * count;
            let opponent = -1;
            for(let i = 0; i < opponent_num; i++)
            {
                opponent++;
                if(!POKEDEX.pokemon[opponent]){i--;}
            }
            
            const OPO_IMG = await Canvas.loadImage('./img/pokedex/' + POKEDEX.pokemon[opponent].name.toLowerCase() + '.jpg');
            context.drawImage(OPO_IMG, 200, 200, 230, 320);
            await theMessage.edit('4/' + progressCount + ' ' + EMOJIS.lagging);

            const PLACES = [[172,550], [316,550],[29,697],[172,697],[316,697]];
            let allyIMGS = [];
            for(let j = 0; j < 5; j++)
            {
                const ally_num = Math.random() * count;
                let ally = -1;
                for(let i = 0; i < ally_num; i++)
                {
                    ally++;
                    if(!POKEDEX.pokemon[ally]){i--;}
                }
                const ALLY_IMG = await Canvas.loadImage('./img/pokedex/' + POKEDEX.pokemon[ally].name.toLowerCase() + '.jpg');
                allyIMGS[j] = ALLY_IMG;
                context.drawImage(ALLY_IMG, PLACES[j][0], PLACES[j][1], 100, 100);
                await theMessage.edit((5 + j) + '/' + progressCount + ' ' + EMOJIS.lagging);
            }

            const STATUSES = ['sleep', 'burn', 'freeze', 'confuse', 'inlove', 'paralysis', 'poison'];
            let statusesIMGs = [];
            for(let i = 0; i < STATUSES.length; i++)
            {
                const IMG_STATUS = await Canvas.loadImage('./img/battle/' + STATUSES[i] + '.png');
                context.drawImage(IMG_STATUS, 455, 220 + 40 * i, 30, 30);
                await theMessage.edit((10 + i) + '/' + progressCount + ' ' + EMOJIS.lagging);
                statusesIMGs[i] = IMG_STATUS;
            }

            const attachment = new MessageAttachment(canvas.toBuffer(), 'battle.png');
            const embed = new MessageEmbed().setImage('attachment://battle.png');
        
            await theMessage.edit({embeds: [embed], files: [attachment], content: '_ _'});
                           
            const timeEnd = new Date().getTime();
            const timeDifference = timeEnd - timeStart;
            await theMessage.edit('time: ' + timeDifference / 1000);
            console.log(timeDifference);

            const PICS = 
            {
                background: BGIMG,
                stuffs: stuffs,
                pfp: PFP,
                opo: OPO_IMG,
                ally: allyIMGS,
                status: statusesIMGs
            }

            client.bwe.battle.add(theMessage, author, channel, PICS);
            theMessage.react('980031862900658196');
            theMessage.react('979738787070492793');
        });
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}

}