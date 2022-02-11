const Deck = require('../models/deck.model');
const Match = require('../models/match.model');
const chalk = require('chalk');

const decks = [
   {
      id: '61fddddf8501118044cd4c5b',
      name: 'Fastbites',
      styledName: '<sprite name=Fast>Fastbites',
      ownerId: process.env.VUE_AUTH_ID,
      deckCode: 'CECACAYBAIAQIAITAECQKCIJAEAQWEQWDYSSMKBQG4AQEAIBAEJQA',
      wins: 0,
      losses: 0,
      champions: [
         'Ashe',
         'Senna',
      ],
      regions: [
         'Freljord',
         'Shadow Isles',
      ],
   },
];

const matches = [
   {
      players: [
         {
            playerId: process.env.VUE_AUTH_ID,
            deckId: '61fddddf8501118044cd4c5b',
            deckCode: '',
            initiative: 0,
            outcome: 'win',
         },
         {
            playerId: 'qwerrtyuiop321456987',
            deckId: '61fddddf8501118044cd4c5b',
            deckCode: '',
            initiative: 1,
            outcome: 'loss',
         },
      ],
      gameMode: 'constructed',
      gameType: 'ranked',
      totalTurnCount: 14,
   },
   {
      players: [
         {
            playerId: process.env.VUE_AUTH_ID,
            deckId: '61fddddf8501118044cd4c5b',
            deckCode: '',
            initiative: 0,
            outcome: 'win',
         },
         {
            playerId: 'qwerrtyuiop321456987',
            deckId: '61fddddf8501118044cd4c5b',
            deckCode: '',
            initiative: 1,
            outcome: 'loss',
         },
      ],
      gameMode: 'constructed',
      gameType: 'ranked',
      totalTurnCount: 14,
   },
   {
      players: [
         {
            playerId: process.env.VUE_AUTH_ID,
            deckId: '61fddddf8501118044cd4c5b',
            deckCode: '',
            initiative: 0,
            outcome: 'loss',
         },
         {
            playerId: 'qwerrtyuiop321456987',
            deckId: '61fddddf8501118044cd4c5b',
            deckCode: '',
            initiative: 1,
            outcome: 'win',
         },
      ],
      gameMode: 'constructed',
      gameType: 'ranked',
      totalTurnCount: 14,
   },
];

module.exports = async db => {
   try {
      // drop current collections
      await Promise.all([
         db.dropCollection('decks'),
         db.dropCollection('matches'),
      ]);

      // create new collections
      await Promise.all([
         Deck.insertMany(decks),
         Match.insertMany(matches),
      ]);

      console.log(chalk.yellowBright('database refreshed and seeded'));
   } catch (error) {
      console.log(
         chalk.red('database failed to seed:',
         chalk.white(error),
      ));
      process.exit();
   }
}
