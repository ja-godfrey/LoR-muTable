const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const match = new mongoose.Schema({
   id: ObjectId,
   riot_match_id: String,
   date: Date,
   players: [{
      playerId: String,
      deckId: ObjectId,
      riot_deck_id: String,
      deckCode: String,
      initiative: { type: Number, enum: [0, 1] },
      outcome: { type: String, enum: ['win', 'loss'] },
   }],
   gameMode: String,
   gameType: String,
   totalTurnCount: Number,
});

module.exports = mongoose.model('Match', match);
