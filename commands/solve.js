function calc(operations, numbers)
{
    let numOfSol = 0;
    let calculation = numbers[0] + operations[0] + numbers[1] + operations[1] + numbers[2] + operations[2] + numbers[3];
    if(eval(calculation) == 10){numOfSol++;}
    calculation = "(" + numbers[0] + operations[0] + numbers[1] + operations[1] + numbers[2] + ")" + operations[2] + numbers[3];
    if(eval(calculation) == 10){numOfSol++;}
    calculation = "(" + numbers[0] + operations[0] + numbers[1] + ")" + operations[1] + numbers[2] + operations[2] + numbers[3];
    if(eval(calculation) == 10){numOfSol++;}
    calculation = numbers[0] + operations[0] + "(" + numbers[1] + operations[1] + numbers[2] + operations[2] + numbers[3] + ")";
    if(eval(calculation) == 10){numOfSol++;}
    calculation = numbers[0] + operations[0] + "(" + numbers[1] + operations[1] + numbers[2] + ")" + operations[2] + numbers[3];
    if(eval(calculation) == 10){numOfSol++;}
    calculation = numbers[0] + operations[0] + numbers[1] + operations[1] + "(" + numbers[2] + operations[2] + numbers[3] + ")";
    if(eval(calculation) == 10){numOfSol++;}

    return numOfSol;
}

function check(order, numbers)
{
    let numOfSol = 0;
    if(order.length == 3)
    {
        const OPERATIONS = ['+', '-', '*', '/'];
        for(let i = 0; i < OPERATIONS.length; i++)
        {
            for(let j = 0; j < OPERATIONS.length; j++)
            {
                for(let k = 0; k < OPERATIONS.length; k++)
                {
                    numOfSol+= calc([OPERATIONS[i],OPERATIONS[j],OPERATIONS[k]], [...order, ...numbers]);
                }
            }
        }
    }
    else
    {
        for(let i = 0; i < numbers.length; i++)
        {
            const newNumbers = [...numbers];
            const newOrder = [...order, ...newNumbers.splice(i, 1)];
            
            numOfSol += check(newOrder, newNumbers);
        }
    }

    return numOfSol;
}

function allOrders(order, numbers)
{
    let orders = [];
    if(order.length == 3)
    {
        orders.push(order.join('') + numbers[0]);
    }
    else
    {
        for(let i = 0; i < numbers.length; i++)
        {
            const newNumbers = [...numbers];
            const newOrder = [...order, ...newNumbers.splice(i, 1)];
            
            orders = [...orders, ...allOrders(newOrder, newNumbers)];
        }
    }

    return orders;
}

module.exports = async (message, arguments, client, con, interaction = null) => 
{
    try
    {
        const theArgument = interaction ? interaction.options.getString('numbers') : arguments.join('');
        const reply = (stuffs) => {if(interaction){return interaction.reply(stuffs);}else{return message.channel.send(stuffs);}}
        

        if(isNaN(theArgument * 1) || theArgument.length != 4 || theArgument * 1 < 0 || theArgument[0] == '+'){return reply('please send 4 one-digit numbers. No need to separate them.');}
        const theNumbers = theArgument.split('');
        const result = check([], theNumbers);
        reply('number of solutions: ' + result);
        if(result == 0)
        {
            con.query('select number from unsolvable', (err, nums) =>
            {
                if(err) return reply('' + err);
                const exceptions = nums.map(cell => cell.number);
                if(exceptions.indexOf(theArgument) == -1)
                {
                    let theOrders = allOrders([], theNumbers);
                    console.log(theOrders);
                    let changes = true;
                    while(changes)
                    {
                        changes = false;
                        for(let i = 0; i < theOrders.length; i++)
                        {
                            for(j=i+1; j < theOrders.length;j++)
                            {
                                if(theOrders[i] == theOrders[j])
                                {
                                    theOrders.splice(j,1);
                                    changes = true;
                                }
                            }
                        }
                    }
                    let theValues = '("' + theOrders[0] + '")';
                    for(let i = 1; i < theOrders.length; i++){theValues += ', ("' + theOrders[i] + '")';}
                    con.query('insert into unsolvable (number) values ' + theValues, (error, _) =>
                    {
                        if(error) return reply('' + error);
                        reply('new exception added');
                    });
                }

            });
        }
        
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}