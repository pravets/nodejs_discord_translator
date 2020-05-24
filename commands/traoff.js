module.exports = (client, message, args) => {
    require('../functions/func').disableAutoTranslate(message.guild.id, message.author.id, message.channel.id);
};