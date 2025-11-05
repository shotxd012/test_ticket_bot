const { Ticket, GuildConfig } = require('../models');
const { closeTicket } = require('./ticketClosure');

let autoCloseInterval;

function initAutoCloseScheduler(client) {
    autoCloseInterval = setInterval(async () => {
        const guilds = await GuildConfig.find({ 'autoClose.enabled': true });
        for (const guildConfig of guilds) {
            const ticketsToClose = await Ticket.find({
                guildId: guildConfig.guildId,
                status: 'open',
                lastActivity: { $lt: new Date(Date.now() - guildConfig.autoClose.inactivityPeriod) },
            });

            for (const ticket of ticketsToClose) {
                const botUser = client.user;
                await closeTicket(ticket, botUser, 'Auto-closed due to inactivity.');
            }
        }
    }, 900000); // Check every 15 minutes
}

function stopAutoCloseScheduler() {
    clearInterval(autoCloseInterval);
}

module.exports = {
    initAutoCloseScheduler,
    stopAutoCloseScheduler,
};
