require('dotenv').config()

const Discord = require('discord.js');
const client = new Discord.Client();
client.ya_translate = require('ya-translate')(process.env.YA_TRANSLATE_TOKEN);
client.mongoose = require('mongoose');
client.log = require('./functions/log.js');
client.prefix = prefix = process.env.BOT_PREFIX;



const discord_token = process.env.DISCORD_TOKEN;

//commands
client.commands = new Discord.Collection();
client.commands.set('trhelp', require('./commands/trhelp'));
client.commands.set('ping', require('./commands/ping'));
client.commands.set('tra', require('./commands/tra'));
client.commands.set('traon', require('./commands/traon'));
client.commands.set('traoff', require('./commands/traoff'));
client.commands.set('translate', require('./commands/translate'));

//events
client.on('ready', () => require('./events/ready.js')(client));
client.on('message', message => require('./events/message.js')(client, message));
client.on('guildCreate', guild => require('./events/guildCreate.js')(client, guild));


async function start() {
    try {
        await client.mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        client.log('Log', 'MongoDB connected', 'MongoDB')

        client.login(process.env.DISCORD_TOKEN);;
    } catch (e) {
        client.log('Error', e, 'MongoDB');
    }
}

start();