const chalk = require('chalk');

const colors = {
   db: chalk.magenta,
   warn: chalk.yellowBright,
   error: chalk.red,
   server: chalk.cyan,
   plain: chalk.white,
}

module.exports = {
   db: message => console.log(colors.db('[mongoose]:', colors.plain(message))),
   warn: message => console.log(colors.warn(`[warn]: ${message}`)),
   error: message => console.log(colors.error('[error]:', colors.plain(message))),
};
