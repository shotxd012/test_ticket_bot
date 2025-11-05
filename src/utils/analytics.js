const { Ticket, StaffActions, UserStats } = require('../models');

async function getGuildStats(guildId) {
    const totalTickets = await Ticket.countDocuments({ guildId });
    const openTickets = await Ticket.countDocuments({ guildId, status: 'open' });
    const closedTickets = await Ticket.countDocuments({ guildId, status: 'closed' });
    const claimedTickets = await Ticket.countDocuments({ guildId, status: 'claimed' });

    const staffActions = await StaffActions.aggregate([
        { $match: { guildId } },
        { $group: { _id: '$staffId', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
    ]);

    return {
        totalTickets,
        openTickets,
        closedTickets,
        claimedTickets,
        topStaff: staffActions,
    };
}

// Add other stats functions as needed

module.exports = {
    getGuildStats,
};
