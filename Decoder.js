const { DeckEncoder } = require("runeterra");
const chalk = require('chalk');

const deckCode = process.argv[2];
console.log(chalk.greenBright(deckCode));

try {
   const deckList = DeckEncoder.decode(deckCode);
   console.log(deckList);
} catch (error) {
   console.log(error);
}
