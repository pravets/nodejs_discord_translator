module.exports = (client, message) => {
    if (message.author.bot) return;

    let args = [];
    let command = '';

    if (message.content.indexOf(client.prefix) !== 0) {
        args = [message.content];
        command = 'translate';
    } else {

        args = message.content.slice(client.prefix.length).trim().split(/ +/g);
        command = args.shift().toLowerCase();

    }
    if (client.commands.has(command)) {
        client.commands.get(command)(client, message, args);
    }
};