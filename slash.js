const DATA = require('./data.json');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const clientId = '934774688419282984';

const commands = [
	new SlashCommandBuilder().setName('help').setDescription('Shows list of commands or info about the command').addStringOption(option => option.setName('command').setDescription('Write command to check info about it.')),
	new SlashCommandBuilder().setName('welcomechannel').setDescription('set/change/check welcome channel').addChannelOption(option => option.setName('channel').setDescription('channel when message will be sent')),
	new SlashCommandBuilder().setName('test').setDescription('test').addIntegerOption(option => option.setName('number').setDescription('number of example character').setRequired(true)),
	new SlashCommandBuilder().setName('oc').setDescription('shows the picture of Szibi\'s or Fairy\'s OC').addStringOption(option => option.setName('name').setDescription('name of OC')),
	new SlashCommandBuilder().setName('pic').setDescription('shows the picture of pokemon').addStringOption(option => option.setName('name').setDescription('name of Pokemon')),
	new SlashCommandBuilder().setName('play').setDescription('play music').addStringOption(option => option.setName('song').setDescription('name of song, author or link').setRequired(true)),
	new SlashCommandBuilder().setName('remove').setDescription('remove song from queue').addIntegerOption(option => option.setName('song').setDescription('number of song in queue').setRequired(true)),
	new SlashCommandBuilder().setName('queue').setDescription('create queue message'),
	new SlashCommandBuilder().setName('roll').setDescription('roll a number').addIntegerOption(option => option.setName('max').setDescription('max number').setRequired(true)).addIntegerOption(option => option.setName('count').setDescription('number or rolls')),
	new SlashCommandBuilder().setName('activelevel').setDescription('set/change leveling channel - it actives leveling in server').addChannelOption(option => option.setName('channel').setDescription('channel when i message about level up will be sent')),
	new SlashCommandBuilder().setName('connectchannel').setDescription('set/check connection channel').addStringOption(option => option.setName('code').setDescription('connection code. must be the same in 2 or more channels to make connection')),
	new SlashCommandBuilder().setName('level').setDescription('show actual level'),

].map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(DATA.token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');
		await rest.put(Routes.applicationCommands(clientId),{ body: commands },);
		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();