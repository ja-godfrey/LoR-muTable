const Match = require('../models/match.model');
const getUserId = require('../utils/getUserId');

module.exports = {
   userMatchPerformance: async (req, res) => {
      const userId = getUserId(req);
      const matches = await Match.find({ 'players.playerId': userId });
      const result = matches.reduce((prev, next) => {
         const player = next.players.find(p => p.playerId === userId);
         if (player.outcome === 'win') return { wins: prev.wins + 1, losses: prev.losses };
         else return { wins: prev.wins, losses: prev.losses + 1 };
      }, { wins: 0, losses: 0 });

      res.status(200).send({ ...result, ratio: result.wins / result.losses });
   },
};
