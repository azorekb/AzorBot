const Canvas = require('canvas');
const POKEMON = require('../jsony/pokemon.json');
const TYPES_LIST = require('../jsony/pokemontypes.json');
const { MessageAttachment } = require('discord.js');

const getPokemonNumberByName = (_name) =>
{
    for(let i = 0; i < POKEMON.list.length; i++)
    {
        if(POKEMON.list[i][0].toLowerCase() == _name.toLowerCase()){return i;}
    }

    return -1;
}

module.exports = async (aMessage, client, con, interaction = null) => 
{
    try
    {
        const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return aMessage.message.channel.send(stuffs);}}
        const member = interaction ? interaction.member : aMessage.message.member;
        // const theArgument = interaction ? interaction.options.getInteger('number') : aMessage.arguments[0]*1;
        con.query('select * from players where user = "' + member.id + '";', async (error, result) =>
        {
            if(error)
            {
                reply('error: ' + error);
            }
            else
            {
                if(result.length)
                {
                    const SPECIE = getPokemonNumberByName(result[0].specie);
                    const SPECIE_NAME = result[0].specie;
                    const FORM = result[0].form;
                    const TYPES = FORM == 'regular' ? [POKEMON.list[SPECIE][1],POKEMON.list[SPECIE][2]] : [POKEMON.forms[SPECIE + 1][FORM][0],POKEMON.forms[SPECIE + 1][FORM][1]];
                    const NAME = result[0].name;
                    const GENDER = result[0].gender;
                    const IMG = result[0].imgURL;
                    const LEVEL = result[0].level;

                    let colour, bgc;
                    switch(TYPES[0].toLowerCase())
                    {
                        case 'normal': colour = '#f00'; bgc = '#fbb'; break;
                        case 'grass': colour = '#007E00'; bgc = '#E5F3A5'; break;
                        case 'bug': colour = '#007E00'; bgc = '#E5F3A5'; break;
                        case 'ghost': colour = '#555'; bgc = '#eee'; break;
                        case 'dark': colour = '#000'; bgc = '#ccc'; break;
                        case 'poison': colour = '#444'; bgc = '#dde'; break;
                        case 'electric': colour = '#00f'; bgc = '#fd5'; break;
                        case 'steel': colour = '#aaa'; bgc = '#888'; break;
                        case 'fairy': colour = '#55f'; bgc = '#def'; break;
                        case 'ground': colour = '#865'; bgc = '#ed9'; break;
                        case 'rock': colour = '#865'; bgc = '#ed9'; break;
                        case 'ice': colour = '#00f'; bgc = '#def'; break;
                        case 'fighting': colour = '#8b7'; bgc = '#efe'; break;
                        case 'water': colour = '#000'; bgc = '#eed'; break;
                    }
            
                    const canvas = Canvas.createCanvas(1626, 1262);
                    const context = canvas.getContext('2d');
                    const background = await Canvas.loadImage('./img/types/' + TYPES_LIST[client.bwe.getTypeNumberByName(TYPES[0])].table);
                    context.drawImage(background, 0, 0, canvas.width, canvas.height);
                    const avatar = await Canvas.loadImage(IMG);
                    context.drawImage(avatar, 277, 242, 327, 311);
                    context.font = '48px comic Sans MS';
                    context.fillStyle = colour;
                    const formText = FORM == 'regular' ? '' : FORM + ' ';
                    context.fillText(NAME + " the " + formText + SPECIE_NAME, 684, 325);
                    let typesNames = TYPES[0];
                    if(TYPES[1] != '-'){typesNames += '/' + TYPES[1];}
                    context.fillText(typesNames, 690, 442);
                    context.font = '64px comic Sans MS';
                    context.fillText(LEVEL + 'lvl', 1038, 432);
                    const typeUno = await Canvas.loadImage('./img/types/' + TYPES[0].toLowerCase() + '.png');
                    context.drawImage(typeUno, 200, 495, 125, 125);
                    if(TYPES[1] != '-')
                    {
                        const typeDuo = await Canvas.loadImage('./img/types/' + TYPES[1].toLowerCase() + '.png');
                        context.drawImage(typeDuo, 555, 495, 125, 125);
                    }
                    const POKMEON_HP = Math.ceil(Math.random() * 1000);
                    for(let i = 0; i < 4; i++)
                    {
                        if(POKMEON_HP > i * 250)
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
                            if(POKMEON_HP <= 250 * (i + 1)){max = Math.ceil(135 * (POKMEON_HP - i * 250) / 250);}
                            context.beginPath();
                            context.moveTo(x, y);
                            context.lineTo(x + max, y);
                            context.lineTo(x + 23 + max, y + 57);
                            context.lineTo(x + 23, y + 57);
                            context.closePath();
                            context.fill();
                        }
                    }
            
                    context.fillStyle = bgc;
                    context.font = '50px comic Sans MS';
                    context.textAlign = 'center';
                    context.fillText(POKMEON_HP, 800, 570);

                    const VALUES = [[Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 100)], [Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 100)], [Math.ceil(Math.random() * 100), Math.ceil(Math.random() * 100)]];
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
                            context.fillStyle = colour;
                            context.fillText(VALUES[i][j], x - 50, y + 70);
                        }
                    }

                    const IMGGender = GENDER == 'm' ? await Canvas.loadImage('./img/male.png') : await Canvas.loadImage('./img/female.png');
                    if(GENDER != 'n'){context.drawImage(IMGGender, 566, 167, 110, 110);}
            
                    const attachment = new MessageAttachment(canvas.toBuffer(), 'character.png');
                    reply({ files: [attachment] });
                }
                else
                {
                    reply('you don\'t have character in da game');
                }
            }
        });


    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}