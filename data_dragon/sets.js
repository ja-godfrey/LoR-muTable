/**
 * Fetch set data from Riot's Data Dragon
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

/* UPDATE THIS VALUE TO EQUAL THE MOST RECENT SET NUMBER */
/* DON'T FORGET TO ADD NEW SETS TO CONCAT IN src/data/sets/index(.server).js */
const sets = 6;

console.log(chalk.magentaBright('Starting set download. This could take a while...'));

/* remove old data */
/* we do this separately so if something fails to delete/extract, it's easy to find and fix the problem */
for (let i = 1; i <= sets; i++) {
   const path = `./src/data/sets/set${i}.json`
   if (fs.existsSync(path)) {
      fs.unlinkSync(path, handleError);
   }
}

/* retrieve data for each set -- we are not keeping card images */
for (let i = 1; i <= sets; i++) {
   /* create tmp file, download and extract data */
   console.log(chalk.yellow(`Extracting set ${i}...`));
   fs.mkdirSync('./tmp', { recursive: false }, handleError);
   run(`curl.exe --output ./tmp/set.zip --url https://dd.b.pvp.net/latest/set${i}-lite-en_us.zip`);
   run('unzip ./tmp/set.zip -d ./tmp');

   /* add new data*/
   fs.renameSync(`./tmp/en_us/data/set${i}-en_us.json`, `./src/data/sets/set${i}.json`, handleError);

   /* remove top level tmp file and finish set extraction */
   fs.rmdirSync('./tmp', { recursive: true }, handleError);
   console.log(chalk.yellow(`Set ${i} extracted...`));
}

console.log(chalk.cyan('Success! Set data has been updated.'));
