const Canvas = require('canvas');
const POKEMON = require('../jsony/pokemon.json');
const TYPES = require('../jsony/pokemontypes.json');
const { MessageAttachment } = require('discord.js');
class Pokemon_test
{
    constructor(specie, hp, atk, def, spatk, spdef, speed, luck)
    {
        this.specie = POKEMON.list[specie - 1][0];
        this.types = [POKEMON.list[specie - 1][1],POKEMON.list[specie - 1][2]];
        this.hp = hp;
        this.attack = atk;
        this.defence = def;
        this.spAttack = spatk;
        this.spDefence = spdef;
        this.speed = speed;
        this.luck = luck;
    }
}

module.exports = async (aMessage, client, con, interaction = null) => 
{
    try
    {
        const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
        const member = interaction ? interaction.member : aMessage.message.member;
        let thePokemon = new Pokemon_test(152, 10, 20, 30,45,50,60,70);

        const canvas = Canvas.createCanvas(1626, 1262);
        const context = canvas.getContext('2d');
        const background = await Canvas.loadImage('./img/types/' + TYPES[client.bwe.getTypeNumberByName(thePokemon.types[0])].table);
        context.drawImage(background, 0, 0, canvas.width, canvas.height);
        const avatar = await Canvas.loadImage(member.displayAvatarURL({ format: 'png' }));
        context.drawImage(avatar, 277, 242, 327, 311);
        context.font = '48px comic Sans MS';
        context.fillStyle = '#007E00';
        context.fillText(member.displayName + " the " + thePokemon.specie, 684, 325);
        let typesNames = thePokemon.types[0];
        if(thePokemon.types[1] != '-'){typesNames += '/' + thePokemon.types[1];}
        context.fillText(typesNames, 690, 442);
        context.font = '64px comic Sans MS';
        context.fillText('15lvl', 1038, 432);
        const typeUno = await Canvas.loadImage('./img/types/' + thePokemon.types[0].toLowerCase() + '.png');
        context.drawImage(typeUno, 200, 495, 125, 125);
        if(thePokemon.types[1] != '-')
        {
            const typeDuo = await Canvas.loadImage('./img/types/' + thePokemon.types[1].toLowerCase() + '.png');
            context.drawImage(typeDuo, 555, 495, 125, 125);
        }
        for(let i = 0; i < 4; i++)
        {
            if(thePokemon.hp > i * 250)
            {
                let x; 
                let y;
                switch(i)
                {
                    case 0: x = 724; y = 521; break;
                    case 1: x = 878; y = 520; break;
                    case 2: x = 1035; y = 520; break;
                    case 3: x = 1196; y = 519; break;
                }
                let max = 135;
                if(thePokemon.hp <= 250 * (i + 1)){max = Math.ceil(135 * (thePokemon.hp - i * 250) / 250);}
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(x + max, y);
                context.lineTo(x + 23 + max, y + 57);
                context.lineTo(x + 23, y + 57);
                context.closePath();
                context.fill();
            }
        }

        context.fillStyle = '#E5F3A5';
        context.font = '50px comic Sans MS';
        context.textAlign = 'center';
        context.fillText(thePokemon.hp, 800, 570);

        const VALUES = [[thePokemon.attack, thePokemon.spAttack], [thePokemon.defence, thePokemon.spDefence], [thePokemon.speed, thePokemon.luck]];
        const IMGline = await Canvas.loadImage('./img/line.png');
        const emptyline = await Canvas.loadImage('./img/emptyline.png');
        for(let i = 0; i < 3; i++)
        {
            for(let j = 0; j < 2; j++)
            {
                let x = 795 + (j * 411);
                let y = 670 + (i * 122);
                for(let k = 0; k < 6; k++)
                {
                    if(VALUES[i][j] >= (100 / 6 * k))
                    {
                        context.drawImage(IMGline, x + k * 42, y);
                    }
                    else
                    {
                        context.drawImage(emptyline, x + k * 42, y);
                    }
                }

                context.font = '40px comic Sans MS';
                context.fillStyle = '#007E00';
                context.fillText(VALUES[i][j], x - 50, y + 70);
            }
        }

        const attachment = new MessageAttachment(canvas.toBuffer(), 'character.png');
        reply({ files: [attachment] });
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}