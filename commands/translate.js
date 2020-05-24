module.exports = async(client, message, args) => {
    const lang_arr = await require('../functions/func').getLangsForTranslate(message.guild.id, message.author.id, message.channel.id);
    let response = "```" + args[0] + '\n';
    if (lang_arr.length) {
        for (i = 0; i < lang_arr.length; i++) {
            const translate_result = await client.ya_translate(args[0], lang_arr[i]);
            response += `${lang_arr[i]} : ${translate_result.text} \n`;
        }
        response += "```";
        message.reply(response);
    }
}