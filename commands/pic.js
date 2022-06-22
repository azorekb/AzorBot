module.exports = async (aMessage, client, con, interaction = null) => 
{
    try
    {
        const run = require('./oc');
        run(aMessage, client, con, interaction, 'pic');
    }
    catch(error){client.bwe.theError(error, aMessage, interaction)}
}