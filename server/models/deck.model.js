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
   name: { type: String, required: true },
   styledName: String,
   ownerId: { type: String, required: true },
   riot_deck_id: String,
   deckCode: { type: String, required: true },
   champions: [String],
   regions: [{ type: String, enum: regions }],
   notes: String,
   tags: { type: [String], default: [] },
   favorite: { type: Boolean, default: false },
   matches: [Match],
   history: [{
      name: { type: String, required: true },
      deckCode: { type: String, required: true },
      matches: [Match],
      notes: String,
      tags: [String],
      retiredOn: Date,
   }],
   createdOn: { type: Date, default: () => Date.now() },
   updatedOn: { type: Date, default: () => Date.now() },
});

module.exports = mongoose.model('Deck', deck);
