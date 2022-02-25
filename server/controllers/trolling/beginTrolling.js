const got = require('got');
const chalk = require('chalk');
const baseUrl = require('../../riotUrl');

const { RIOT_TOKEN } = process.env;
const headers = { 'X-Riot-Token': RIOT_TOKEN };

module.exports = (req, res) => {
   const { puuid } = req.params;
   const { pings } = req.query;

   /* limit pings to 3, with a default of 0 (initial ping doesn't count) */
   const totalPings = pings
      ? pings > 3
         ? 3
         : pings
      : 0;

   let runCount = 0;
   (async function getMatches() {
      runCount += 1;

      let matchCodes = [];

      /* get last 20 match codes for user */
      try {
         matchCodes = await got(`${baseUrl}/match/v1/matches/by-puuid/${puuid}/ids`, { headers })
            .json();
      } catch (error) {
         console.log(chalk.red('Failed to get last 20 matches'));
         console.log(error);
         res.sendStatus(500);
         return;
      }

      /* get match data for each match code */
      const matches = await Promise.all(matchCodes.map(async (matchId, i) => {
         try {
            console.log(`getting data for match ${i}...`);
            const matchData = await got(`${baseUrl}/match/v1/matches/${matchId}`, { headers })
               .json();
            return matchData;
         } catch (error) {
            console.log(chalk.red('Failed to get match data'));
            console.log(error);
            res.sendStatus(500);
            return;
         }
      }));

      res.status(200).send(matches);

      /* run again at the end of the hour if more pings are requested */
      // if (runCount <= totalPings) {
      //    setTimeout(getMatches, 1000 * 60 * 60);
      // }
   })();
};
