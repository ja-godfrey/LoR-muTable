const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

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
   id: ObjectId,
   outcome: { type: String, enum: ['win', 'loss'] },
   initiative: { type: Number, enum: [0, 1] },
   enemyRegions: [{ type: String, enum: regions }],
   enemyChamps: [String],
   notes: String,
   date: { type: Date, default: () => Date.now() },
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
   tags: { type: [String], default: [] },
   matches: [Match],
   history: [{
      name: String,
      deckCode: String,
      matches: [Match],
      notes: String,
      retiredOn: Date,
   }],
   createdOn: { type: Date, default: () => Date.now() },
   updatedOn: { type: Date, default: () => Date.now() },
});

module.exports = mongoose.model('Deck', deck);
