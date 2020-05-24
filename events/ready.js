module.exports = (client) => {
    client.log('Log', `Запустился бот ${client.user.username}`);
    client.generateInvite([522304]).then(link => { client.log('Log', `${link}`, 'Invite'); });
    client.user.setActivity(client.prefix + "trhelp", { type: "LISTENING" });
};