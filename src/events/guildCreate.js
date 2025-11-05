const { GuildConfig } = require('../models');
const logger = require('../utils/logger');
const { deployCommands } = require('../utils/commandDeployer');

module.exports = {
    name: 'guildCreate',
    async execute(guild) {
        logger.logInfo('Joined a new guild', { guildId: guild.id, guildName: guild.name });

        try {
            await GuildConfig.findOneAndUpdate(
                { guildId: guild.id },
                { guildId: guild.id },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            if (process.env.NODE_ENV === 'production') {
                await deployCommands('guild', guild.id);
            }

            if (guild.systemChannel) {
                guild.systemChannel.send('Thanks for inviting me! Please use the `/setup` command to get started.');
            }

        } catch (error) {
            logger.logError('Error on guildCreate event', { guildId: guild.id, error: error });
        }
    },
};
