module.exports = (client, message, args) => {
    message.reply("\n```" +
        prefix + "trhelp - this command\n" +
        prefix + "tra languages - example /tra en,fr, add selected languages to auto translate\n" +
        prefix + "traon - enable auto translate\n" +
        prefix + "traoff - disable auto translate\n" +
        prefix + "ping - pong```\n");
}