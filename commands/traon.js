module.exports = (client, message, args) => {
    require('../functions/func').enableAutoTranslate(message.guild.id, message.author.id, message.channel.id);
};