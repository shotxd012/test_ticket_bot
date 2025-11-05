const mongoose = require('mongoose');
const logger = require('./logger');

const connectDatabase = async (retries = 3) => {
    while (retries > 0) {
        try {
            await mongoose.connect(process.env.MONGODB_URI);
            logger.logInfo('Connected to MongoDB');
            return;
        } catch (error) {
            logger.logError(`Error connecting to MongoDB: ${error.message}. Retries left: ${retries - 1}`);
            retries--;
            await new Promise(res => setTimeout(res, 5000)); // Wait 5 seconds before retrying
        }
    }
    logger.logError('Could not connect to MongoDB after multiple retries. Exiting.');
    process.exit(1);
};

mongoose.connection.on('disconnected', () => {
    logger.logWarn('Disconnected from MongoDB');
});

module.exports = { connectDatabase };
