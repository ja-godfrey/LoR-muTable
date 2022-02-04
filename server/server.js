require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const chalk = require('chalk');
// const got = require('got');

const app = express();

app.use(helmet());
app.use(express.json());


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


const port = process.env.PORT || 9090;
app.listen(port, () => console.log(chalk.cyan.underline(`eavesdropping on port ${port}`)));

