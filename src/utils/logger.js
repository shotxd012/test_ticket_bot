const chalk = require('chalk');

const logLevels = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
};

const currentLogLevel = process.env.LOG_LEVEL || 'info';

const log = (level, message, context) => {
    if (logLevels[level] >= logLevels[currentLogLevel]) {
        const timestamp = new Date().toISOString();
        const contextString = context ? chalk.gray(JSON.stringify(context)) : '';
        const levelString = {
            debug: chalk.gray('DEBUG'),
            info: chalk.green('INFO'),
            warn: chalk.yellow('WARN'),
            error: chalk.red('ERROR'),
        }[level];

        console.log(`[${chalk.cyan(timestamp)}] [${levelString}] ${message} ${contextString}`);
    }
};

const logDebug = (message, context) => log('debug', message, context);
const logInfo = (message, context) => log('info', message, context);
const logWarn = (message, context) => log('warn', message, context);
const logError = (message, context) => log('error', message, context);

module.exports = {
    logDebug,
    logInfo,
    logWarn,
    logError,
};
