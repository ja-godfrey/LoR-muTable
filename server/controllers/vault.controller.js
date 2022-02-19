const { DeckEncoder } = require('runeterra');
const pick = require('lodash/pick');
const uniq = require('lodash/uniq');
const chalk = require('chalk');
const Deck = require('../models/deck.model');
const getUserId = require('../utils/getUserId');
const REGIONS = require('../data/regions.constants');

// get user deck catalog and expose allowed properties
const findUserDecks = async userId => {
   const decks = await Deck.find({ ownerId: userId });
   return decks.map(deck => pick(deck, [
      '_id',
      'name',
      'styledName',
      'deckCode',
      'champions',
      'regions',
      'notes',
      'tags',
   ]));
};

const getDeckCode = async deckId => {
   const deck = await Deck.find({ _id: deckId });
   return deck.deckCode;
};

const getDeckRegions = deckCode => {
   let regions = [];

   try {
      const deckList = DeckEncoder.decode(deckCode);
      const factions = deckList.map(card => REGIONS[card.faction.shortCode]);
      regions = uniq(factions);
   } catch (error) {
      console.log(chalk.yellow('Deck could not be decoded...'), chalk.white(error));
   }

   return regions;
};

module.exports = {
   getAllDecks: async (_, res) => {
      try {
         const decks = await Deck.find();
         res.status(200).send({ data: decks });
      } catch (error) {
         console.log(error);
         res.status(400).send({ error });
      }
   },

   getDecksByUser: async (req, res) => {
      try {
         const decks = await findUserDecks(getUserId(req));
         res.status(200).send({ data: decks });
      } catch (error) {
         res.status(400).send({ error });
      }
   },

   getDeck: async (req, res) => {
      try {
         const deck = await Deck.findById(req.params.id);
         res.status(200).send({ data: deck });
      } catch (error) {
         res.status(400).send({ error });
      }
   },

   createDeck: async (req, res) => {
      const userId = getUserId(req);
      let regions = [];
      let tags = [];

      if (req.body.deckCode) {
         regions = getDeckRegions(req.body.deckCode);
      }

      if (req.body.tags) {
         tags = req.body.tags.map(tag => tag.toLowerCase());
      }

      try {
         const deck = new Deck({
            ...req.body,
            ownerId: userId,
            regions,
            tags,
         });
         const newDeck = await deck.save();
         const decks = await findUserDecks(userId);

         res.status(200).send({
            data: decks,
            newId: newDeck._id,
            ...(regions.length === 0)
               && { warning: 'The DeckEncoder failed to decode the deck code. Stored regions may not be accurate.' },
         });
      } catch (error) {
         res.status(400).send({ error });
      }
   },

   updateDeck: async (req, res) => {
      let regions = [];
      let history = [];

      if (req.body.deckCode) {
         // get new regions
         regions = getDeckRegions(req.body.deckCode);

         // copy current deck into history if deck code is new
         const currentDeck = await Deck.find(req.params.id);
         if (req.body.deckCode !== currentDeck.deckCode) {
            history = [
               {
                  name: currentDeck.name,
                  deckCode: currentDeck.deckCode,
                  matches: currentDeck.matches,
                  retiredOn: Date.now(),
               },
               ...currentDeck.history,
            ];
         }
      }

      try {
         await Deck.findOneAndUpdate({ _id: req.params.id }, {
            ...req.body,
            ...(regions.length > 0) && { regions },
            /* if deckCode has been updated, add current deck to history and refresh matches */
            ...(history.length > 0) && { matches: [], history },
            updatedOn: Date.now(),
         });

         const decks = await findUserDecks(getUserId(req));
         res.status(200).send({
            data: decks,
            ...(regions.length === 0)
               && { warning: 'The DeckEncoder failed to decode the deck code. Stored regions may not be accurate.' },
         });
      } catch (error) {
         res.status(400).send({ error });
      }
   },

   addMatchToDeck: async (req, res) => {
      const { id } = req.params;
      const { match } = req.body;

      try {
         await Deck.findOneAndUpdate({ _id: id }, {
            '$push': { matches: match },
         });

         const decks = await findUserDecks(getUserId(req));
         res.status(200).send({ data: decks });
      } catch (error) {
         res.status(400).send({ error });
      }
   },

   deleteDeck: async (req, res) => {
      const { id } = req.params;

      try {
         await Deck.findById(id).remove();

         const decks = await findUserDecks(getUserId(req));
         res.status(200).send({ data: decks });
      } catch (error) {
         res.status(400).send({ error });
      }
   },
};
