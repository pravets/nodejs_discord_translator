module.exports = (client, message, args) => {
    lang_arr = args[0].split(',');
    (async() => {
        const is_valid = await require('../functions/func').validateLangs(lang_arr);
        if (is_valid) {
            result = await require('../functions/func').setUserConfig(message.guild.id, message.author.id, message.author.tag, message.channel.id, lang_arr);
        }
    })();
};