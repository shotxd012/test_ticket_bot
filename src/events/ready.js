const logger = require('../utils/logger');
const { ActivityType } = require('discord.js');

module.exports = {
    name: 'clientReady',
    once: true,
    execute(client) {
        logger.logInfo(`Ready! Logged in as ${client.user.tag}`);
        logger.logInfo(`Bot is in ${client.guilds.cache.size} guilds.`);
        client.user.setPresence({
            activities: [{ name: '/help for commands', type: ActivityType.Watching }],
            status: 'online',
        });
    },
};
