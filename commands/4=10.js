function numberOf(arg, arr)
{
    const index = arr.indexOf(arg);
    if(index == -1) return 0;
    return 1 + numberOf(arg, arr.slice(index + 1));
}

module.exports = async (message, arguments, client, con, interaction = null) => 
{
    try
    {
        const theArgument = interaction ? interaction.options.getString('argument') : arguments.join('');
        const author = interaction ? interaction.member.id : message.author.id;
        const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return message.channel.send(stuffs);}}
        con.query('select numbers, solved from `4=10` where player = "' + author + '"', (err, rows) =>
        {
            if(err){return reply(' ' + err);}
            if(theArgument)
            {
                if(theArgument == 'info') return reply({files: ['./img/trade.jpg'], content:'**4=10 mini game**\nI give you 4 one-digit numbers and you can put it into any order separating them with one of four operators: + - * / plus you can use one bracket, but result of calculation must be always 10.\n\n**Example:**\nI give you 1234\nyou you must answer with for example 1+2+3+4 (this is one of many posibilities) cus 1+2+3+4 = 10'})
                if(rows.length && rows[0].numbers != '-')
                {
                    let isOK = true;
                    const theNumbers = rows[0].numbers.split('');
                    const operators = ['+', '-', '*', '/'];
                    const youCanUse = [...theNumbers, ...operators, '(', ')'];
                    let errors = 'something is wrong, make sure you use only stuffs you can use: ' + youCanUse.join(' ') + '\n';
                    for(let i = 0; i < theArgument.length; i++){if(youCanUse.indexOf(theArgument[i]) == -1){isOK = false; errors += 'wrong key: ' + theArgument[i] + '\n';}}
                    const left = numberOf('(', theArgument);
                    const right = numberOf(')', theArgument);
                    if(left != right){isOK = false; errors += 'number of ( and number of ) isn\'t the same\n';}
                    if(left > 1){isOK = false; errors += 'number of brackets is more than 1\n';}
                    const leftIndex = theArgument.indexOf('(');
                    if(leftIndex > -1)
                    {
                        if(!isNaN(theArgument[leftIndex - 1] * 1)){isOK = false; errors += 'a number on the left of (\n'}
                        if(isNaN(theArgument[leftIndex + 1] * 1)){isOK = false; errors += 'not a number on the right of (\n'}
                    }
                    const rightIndex = theArgument.indexOf(')');
                    if(rightIndex > -1)
                    {
                        if(isNaN(theArgument[rightIndex - 1] * 1)){isOK = false; errors += 'not a number on the left of )\n'}
                        if(!isNaN(theArgument[rightIndex + 1] * 1)){isOK = false; errors += 'a number on the right of )\n'}
                    }
                    if(rightIndex > -1 && rightIndex < leftIndex){isOK = false; errors += ') is before (\n'}
                    for(let i = 0; i < theNumbers.length; i++)
                    {
                        if(numberOf(theNumbers[i], theArgument) != numberOf(theNumbers[i], rows[0].numbers)){isOK = false; errors += 'too many or not enough of ' + theNumbers[i] + '\n';}
                        let index = theArgument.indexOf(theNumbers[i]);
                        while(index > -1)
                        {
                            if(!isNaN(theArgument[index - 1] * 1) || !isNaN(theArgument[index + 1] * 1)){isOK = false; errors += 'not single digit number\n'}
                            index = theArgument.indexOf(theNumbers[i], index + 1);
                        }
                    }
                    for(let i = 0; i < operators.length; i++)
                    {
                        let index = theArgument.indexOf(operators[i]);
                        while(index > -1)
                        {
                            if(operators.indexOf(theArgument[index - 1]) > -1 || operators.indexOf(theArgument[index + 1]) > -1){isOK = false; errors += 'two operators next to themselves';}
                            index = theArgument.indexOf(operators[i], index + 1);
                        }
                    }
                    if(isOK)
                    {
                        if(eval(theArgument) == 10)
                        {
                            con.query('update `4=10` set solved = solved + 1, numbers = "-" where player = "' + author + '"', (error, _) => 
                            {
                                reply('Yes! This is the right answer! Number of solved numbers: ' + (rows[0].solved + 1) + '.');
                            });
                        }
                        else
                        {
                            reply('the result is ' + eval(theArgument) + ', but should be 10. Try again.');
                        }
                    }
                    else reply(errors);
                }
                else reply('You don\'t have any numbers to slove, plase write command without argument to get numbers or write info or help as argument to get informations how it works.');
            }
            else
            {
                con.query('select number from unsolvable', (error, nums) =>
                {
                    if(error){return reply(' ' + error);}
                    
                    const exceptions = nums.map(cell => cell.number);
                    if(rows.length && exceptions.indexOf(rows[0].numbers) == -1 && rows[0].numbers != '-'){return reply('your numbers to solve: ' + rows[0].numbers)}
                    
                    let newNum = '0000';
                    while(exceptions.indexOf(newNum) > -1)
                    {
                        newNum = '' + Math.ceil(Math.random() * 9981 + 18);
                        if(newNum * 1 < 100) newNum = '0' + newNum;
                        if(newNum * 1 < 1000) newNum = '0' + newNum;
                    }
                    if(rows.length) con.query('update `4=10` set numbers = "' + newNum + '" where player = "' + author + '"', (errors, _) =>
                    {
                        if(errors) return reply('' + errors);
                        reply('your numbers to solve: ' + newNum + '\n*write "info" as argument to get informations how it works*');
                    });
                    else con.query('insert into `4=10` (player, numbers) values ("' + author + '", "' + newNum + '")', (errors, _) =>
                    {
                        if(errors) return reply('' + errors);
                        reply('your numbers to solve: ' + newNum + '\n*write "info" as argument to get informations how it works*');
                    });
                })
            }
        });
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}