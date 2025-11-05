const { handleCommandError } = require('../utils/errorHandler');
const logger = require('../utils/logger');
const { handleButton } = require('../utils/buttonHandlers');
const { handleModal } = require('../utils/modalHandlers');
const { handleSelectMenu } = require('../utils/selectMenuHandlers');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction) {
        try {
            // Log interaction details
            logger.logDebug('Interaction received', { 
                type: interaction.type, 
                user: interaction.user ? interaction.user.id : 'Unknown',
                guild: interaction.guild ? interaction.guild.id : 'Unknown'
            });

            if (interaction.isChatInputCommand()) {
                const command = interaction.client.commands.get(interaction.commandName);

                if (!command) {
                    console.error(`No command matching ${interaction.commandName} was found.`);
                    return;
                }

                try {
                    await command.execute(interaction);
                } catch (error) {
                    await handleCommandError(error, interaction);
                }
            } else if (interaction.isButton()) {
                try {
                    await handleButton(interaction);
                } catch (error) {
                    await handleCommandError(error, interaction);
                }
            } else if (interaction.isModalSubmit()) {
                try {
                    await handleModal(interaction);
                } catch (error) {
                    await handleCommandError(error, interaction);
                }
            } else if (interaction.isStringSelectMenu()) {
                try {
                    await handleSelectMenu(interaction);
                } catch (error) {
                    await handleCommandError(error, interaction);
                }
            }
        } catch (error) {
            // Handle any errors that occur in the interaction handler itself
            logger.logError('Error in interaction handler:', error);
            await handleCommandError(error, interaction);
        }
    },
};
