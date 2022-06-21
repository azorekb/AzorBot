module.exports = async (aMessage, client, con, interaction = null) => 
{
    const run = require('./oc');
    run(aMessage, client, con, interaction, 'pic');
}