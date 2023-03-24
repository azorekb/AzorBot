module.exports = async (message, arguments, client, con, interaction = null) => 
{
    try
    {
        const run = require('./oc');
        run(message, arguments, client, con, interaction, 'pic');
    }
    catch(error){client.bwe.theError(error, message, interaction)}
}