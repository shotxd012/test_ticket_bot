const logger = require('./logger');
const { createErrorContainer } = require('./embedBuilder');

async function handleCommandError(error, interaction) {
    // Handle cases where interaction might be undefined or incomplete
    if (!interaction) {
        logger.logError('Command Error (no interaction):', {
            error: error.stack,
        });
        return;
    }

    logger.logError('Command Error:', {
        command: interaction.commandName,
        user: interaction.user ? interaction.user.id : 'Unknown',
        guild: interaction.guild ? interaction.guild.id : 'Unknown',
        error: error.stack,
    });

    // Handle "Unknown interaction" error specifically
    if (error.message.includes('Unknown interaction')) {
        // Interaction has expired, we can't respond to it anymore
        return;
    }

    // Handle "Interaction has already been acknowledged" error
    if (error.message.includes('Interaction has already been acknowledged')) {
        // Interaction was already responded to, nothing more we can do
        return;
    }

    const errorPayload = createErrorContainer('An error occurred while executing this command.');

    try {
        if (interaction.replied) {
            await interaction.followUp(errorPayload).catch(() => {});
        } else if (interaction.deferred) {
            await interaction.editReply(errorPayload).catch(() => {});
        } else {
            errorPayload.flags = 64;
            await interaction.reply(errorPayload).catch(() => {});
        }
    } catch (replyError) {
        logger.logError('Failed to send error message:', replyError);
    }
}

function setupGlobalErrorHandlers() {
    process.on('unhandledRejection', error => {
        logger.logError('Unhandled Rejection:', error);
    });

    process.on('uncaughtException', error => {
        logger.logError('Uncaught Exception:', error);
        process.exit(1);
    });
}

module.exports = {
    handleCommandError,
    setupGlobalErrorHandlers,
};
