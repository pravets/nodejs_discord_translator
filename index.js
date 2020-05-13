require('dotenv').config()

const Discord = require('discord.js');
const bot = new Discord.Client();
const ya_translate = require('ya-translate')(process.env.YA_TRANSLATE_TOKEN);
const mongoose = require('mongoose');

const TranslateCfg = require('./models/TranslateCfg')
const Lang = require('./models/Lang')

const discord_token = process.env.DISCORD_TOKEN;
const prefix = process.env.BOT_PREFIX;

bot.on('ready', () => {
    console.log(`Запустился бот ${bot.user.username}`);
    bot.generateInvite([522304]).then(link => {
        console.log(link);
    });
    bot.user.setActivity(prefix + "tr help", { type: "LISTENING" });
});

bot.on('message', async(msg) => {

    msg_str = msg.content;

    if (msg_str.startsWith(prefix)) {
        if (msg_str.startsWith(prefix + 'tra ')) {
            lang_str = msg_str.replace(prefix + 'tra ', '');
            lang_arr = lang_str.split(',');
            (async() => {
                const is_valid = await validateLangs(lang_arr);
                if (is_valid) {
                    result = await setUserConfig(msg.guild.id, msg.author.id, msg.author.tag, msg.channel.id, lang_arr);
                }
            })();
        }
        if (msg_str.startsWith(prefix + 'traon')) { enableAutoTranslate(msg.guild.id, msg.author.id, msg.channel.id) }
        if (msg_str.startsWith(prefix + 'traoff')) { disabledAutoTranslate(msg.guild.id, msg.author.id, msg.channel.id) }
        if (msg_str === prefix + 'ping') { msg.reply('pong!') }
        if (msg_str.startsWith(prefix + 'tr help')) {
            msg.reply("\n```" +
                prefix + "tr help - this command\n" +
                prefix + "tra languages - example /tra en,fr, add selected languages to auto translate\n" +
                prefix + "traon - enable auto translate\n" +
                prefix + "traoff - disable auto translate\n" +
                prefix + "ping - pong```\n");
        }
    } else {
        (async() => {
            const lang_arr = await getLangsForTranslate(msg.guild.id, msg.author.id, msg.channel.id);
            let response = "```" + msg.content + '\n';
            if (lang_arr.length) {
                for (i = 0; i < lang_arr.length; i++) {
                    const translate_result = await ya_translate(msg.content, lang_arr[i]);
                    response += `${lang_arr[i]} : ${translate_result.text} \n`;
                }
                response += "```";
                msg.reply(response);
            }

        })();

    }

});


async function start() {
    try {
        await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useFindAndModify: false
        });

        bot.login(discord_token);
    } catch (e) {
        console.log(e);
    }
}

start();

async function validateLangs(lang_arr) {
    let is_correct = true;
    console.log(lang_arr.length);
    for (i = 0; i < lang_arr.length; i++) {
        const lang_code = lang_arr[i].trim();
        const lang = await Lang.find({ code: lang_code }).limit(1);
        if (lang.length === 0) {
            is_correct = false;
        }
    }
    return is_correct;
}

async function setUserConfig(guild_id, user_id, user_tag, channel_id, langs) {
    let result = true;
    try {
        let cfgs = await TranslateCfg.find({ guild_id, user_id, channel_id });

        if (cfgs.length > 0) {
            for (i = 0; i < cfgs.length; i++) {
                await TranslateCfg.findByIdAndDelete(cfgs[i].id);
            }
        }

        let cfg = new TranslateCfg({ guild_id, user_id, user_tag, channel_id, langs, enabled: true })

        await cfg.save();
        result = true;
    } catch (e) {
        console.log(e);
        result = false;
    }

    return result;
}

async function getLangsForTranslate(guild_id, user_id, channel_id) {
    let cfg = await TranslateCfg.findOne({ guild_id, user_id, channel_id, enabled: true });

    let result = [];
    if (cfg) {
        result = cfg.langs;
    }
    return result;
}

async function enableAutoTranslate(guild_id, user_id, channel_id) {
    await TranslateCfg.findOneAndUpdate({ guild_id, user_id, channel_id }, { enabled: true });
}

async function disabledAutoTranslate(guild_id, user_id, channel_id) {
    await TranslateCfg.findOneAndUpdate({ guild_id, user_id, channel_id }, { enabled: false });
}