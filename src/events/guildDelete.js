const { GuildConfig, CategoryConfig, Ticket, UserStats, StaffActions } = require('../models');
const logger = require('../utils/logger');

module.exports = {
    name: 'guildDelete',
    async execute(guild) {
        logger.logInfo('Left a guild', { guildId: guild.id, guildName: guild.name });

        try {
            await GuildConfig.deleteOne({ guildId: guild.id });
            await CategoryConfig.deleteMany({ guildId: guild.id });
            await Ticket.deleteMany({ guildId: guild.id });
            await UserStats.deleteMany({ guildId: guild.id });
            await StaffActions.deleteMany({ guildId: guild.id });
            logger.logInfo(`Cleaned up data for guild ${guild.id}`);
        } catch (error) {
            logger.logError('Error cleaning up guild data', { guildId: guild.id, error: error });
        }
    },
};
