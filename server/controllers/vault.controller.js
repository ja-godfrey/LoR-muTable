const { DeckEncoder } = require('runeterra');
const pick = require('lodash/pick');
const uniq = require('lodash/uniq');
const chalk = require('chalk');
const Deck = require('../models/deck.model');
const getUserId = require('../utils/getUserId');
const REGIONS = require('../data/regions.constants');
const { cards } = require('../../src/data/sets/index.server');

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
      'favorite',
   ]));
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

const getDeckChampions = deckCode => {
   return DeckEncoder.decode(deckCode)
      .filter(card => {
         const cardData = cards.find(c => c.cardCode === card.code);
         return cardData.supertype === 'Champion';
      })
      .map(card => cards.find(c => c.cardCode === card.code).name);
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
      if (!req.body.name || !req.body.deckCode) {
         res.status(400).send({ error: 'Body must include name and deckCode properties' });
         return;
      }

      const userId = getUserId(req);
      const regions = getDeckRegions(req.body.deckCode);
      let tags = [];

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
      let champions = [];
      let history = [];

      if (req.body.deckCode) {
         // copy current deck into history if deck code is new
         const currentDeck = await Deck.findById(req.params.id);
         if (req.body.deckCode !== currentDeck.deckCode) {
            console.log(chalk.yellowBright('UPDATING DECK HISTORY'));

            // get new regions and champs
            regions = getDeckRegions(req.body.deckCode);
            champions = getDeckChampions(req.body.deckCode);

            history = [
               {
                  name: currentDeck.name,
                  deckCode: currentDeck.deckCode,
                  matches: currentDeck.matches,
                  tags: currentDeck.tags,
                  regions: currentDeck.regions,
                  champions: currentDeck.champions,
                  retiredOn: Date.now(),
               },
               ...currentDeck.history,
            ];
         }
      }

      try {
         await Deck.findOneAndUpdate({ _id: req.params.id }, {
            ...req.body,
            /* if deckCode has been updated, add current deck to history, refresh matches, and get new regions/champs */
            ...(regions.length > 0) && { regions },
            ...(champions.length > 0) && { champions },
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

      try {
         await Deck.findOneAndUpdate({ _id: id }, {
            '$push': { matches: req.body },
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
