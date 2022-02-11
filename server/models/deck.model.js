const mongoose = require('mongoose');

const regions = [
   'Bandle City',
   'Bilgewater',
   'Demacia',
   'Freljord',
   'Ionia',
   'Noxus',
   'Piltover and Zaun',
   'Shadow Isles',
   'Shurima',
   'Targon',
];

const Match = {
   outcome: { type: String, enum: ['win', 'loss'] },
   enemyRegions: [{ type: String, enum: regions }],
   enemyChamps: [String],
};

const deck = new mongoose.Schema({
   name: String,
   styledName: String,
   ownerId: String,
   riot_deck_id: String,
   deckCode: String,
   champions: [String],
   regions: [{ type: String, enum: regions }],
   notes: String,
   tags: [String],
   matches: [Match],
   history: [{
      name: String,
      deckCode: String,
      matches: [Match],
      retiredOn: Date,
   }],
   createdOn: { type: Date, default: () => Date.now() },
   updatedOn: { type: Date, default: () => Date.now() },
});

module.exports = mongoose.model('Deck', deck);
