/**
 * Fetch core data from Riot's Data Dragon
 */

const { execSync } = require('child_process');
const fs = require('fs');
const chalk = require('chalk');

const handleError = (error, stdout, stderr) => {
   if (error) console.log(chalk.red('Error:'), chalk.white(error));
   if (stderr) console.log(chalk.red('Error:'), chalk.white(stderr));

   if (error || stderr) {
      process.exit(1);
   }
}

const run = args => execSync(args, handleError);

// create tmp file, download and extract data
fs.mkdirSync('./tmp', { recursive: true });
run('curl.exe --output ./tmp/core.zip --url https://dd.b.pvp.net/latest/core-en_us.zip');
run('unzip ./tmp/core.zip -d ./tmp');

// remove old data
fs.rmdirSync('./src/assets/core', { recursive: true }, handleError);
fs.rmdirSync('./src/data/core', { recursive: true }, handleError);

// move data
fs.renameSync('./tmp/en_us/img', './src/assets/core', handleError);
fs.renameSync('./tmp/en_us/data', './src/data/core', handleError);

// cleanup tmp data
fs.rmdirSync('./tmp', { recursive: true }, handleError);
console.log(chalk.cyan('Success! Core data has been updated.'));
