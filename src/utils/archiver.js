const { Ticket, GuildConfig } = require('../models');

// This is a placeholder for future implementation.
// A full implementation would require adding an archiveCategoryId to GuildConfig,
// and then moving the channel to that category and setting permissions.

async function archiveTicket(client, ticket) {
    const guildConfig = await GuildConfig.findOne({ guildId: ticket.guildId });
    if (!guildConfig.archiveCategoryId) {
        return; // No archive category configured
    }

    const guild = await client.guilds.fetch(ticket.guildId);
    const channel = await guild.channels.fetch(ticket.channelId);

    await channel.setParent(guildConfig.archiveCategoryId);
    await channel.permissionOverwrites.edit(ticket.creatorId, { SendMessages: false });

    ticket.status = 'archived';
    await ticket.save();
}

module.exports = {
    archiveTicket,
};
