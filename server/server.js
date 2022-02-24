require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const chalk = require('chalk');
const got = require('got');

const seed = require('./db/seed');

const vault = require('./controllers/vault.controller');
const stats = require('./controllers/stats.controller');

const app = express();

app.use(helmet());
app.use(express.json());

/* connect to database */
mongoose.connect(process.env.MONGOOSE_CONNECTION);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
   console.log(chalk.magentaBright.underline('mongoose connected to database'));
   // seed(db);
   listen();
});

const authCheck = (req, res, next) => {
   if (req.headers['x-user-id']) {
      console.log(`[${req.method}] ${req.url} - ${req.headers['x-user-id']}`);
      next();
   } else {
      console.log(chalk.redBright('User id not defined'));
   }
};

app.get('/api/decks', authCheck, vault.getDecksByUser);
app.get('/api/deck/:id', authCheck, vault.getDeck);
app.post('/api/decks/new', authCheck, vault.createDeck);
app.put('/api/decks/:id', authCheck, vault.updateDeck);
app.delete('/api/decks/:id', authCheck, vault.deleteDeck);

app.post('/api/decks/:id/match', authCheck, vault.addMatchToDeck);

app.get('/api/user/performance', authCheck, stats.userMatchPerformance);

// const getData = async () => {
//    try {
//       const data = await got.get('https://americas.api.riotgames.com/lor/deck/v1/decks/me', {
//          headers: { 'X-Riot-Token': process.env.RIOT_TOKEN },
//       }).json();
//       console.log(data);
//    } catch (error) {
//       console.log('ERROR', error);
//    }
// };

function listen() {
   const port = process.env.PORT || 9090;
   app.listen(port, () => {
      console.log(chalk.cyanBright.underline(`eavesdropping on port ${port}`))
   });
}
