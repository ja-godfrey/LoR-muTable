const { DeckEncoder } = require('runeterra');
const Deck = require('../models/deck.model');
const getUserId = require('../utils/getUserId');

const exposeDeck = deck => {
   const {
      _id, name, styledName, deckCode, champions, regions, notes,
   } = deck;
   return { _id, name, styledName, deckCode, champions, regions, notes };
};

const findUserDecks = async userId => {
   const decks = await Deck.find({ ownerId: userId });
   return decks.map(_deck => exposeDeck(_deck));
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

      if (req.body.deckCode) {
         const deckList = DeckEncoder.decode(req.body.deckCode);
         regions = deckList.regions;
      }

      try {
         const deck = new Deck({
            ...req.body,
            ownerId: userId,
            regions,
         });
         const newDeck = await deck.save();
         const decks = await findUserDecks(userId);

         res.status(200).send({
            data: decks,
            newId: newDeck._id,
         });
      } catch (error) {
         res.status(400).send({ error });
      }
   },

   updateDeck: async (req, res) => {
      let regions = [];

      if (req.body.deckCode) {
         const deckList = DeckEncoder.decode(req.body.deckCode);
         console.log(deckList);
         return;
         regions = deckList.regions;
      }

      try {
         await Deck.findOneAndUpdate({ _id: req.params.id }, {
            ...req.body,
            ...(regions.length > 0) && { regions },
            updatedOn: Date.now(),
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
