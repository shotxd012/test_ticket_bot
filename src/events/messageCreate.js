const { Ticket } = require('../models');

module.exports = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return;

        try {
            const ticket = await Ticket.findOne({ channelId: message.channel.id, status: 'open' });
            if (ticket) {
                ticket.lastActivity = new Date();
                ticket.messages.push({
                    authorId: message.author.id,
                    content: message.content.substring(0, 2000),
                    attachments: message.attachments.map(a => a.url),
                });

                if (!ticket.participants.includes(message.author.id)) {
                    ticket.participants.push(message.author.id);
                }

                await ticket.save();
            }
        } catch (error) {
            console.error('Error updating ticket activity:', error);
        }
    },
};
