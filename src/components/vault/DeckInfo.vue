<script>
import { watch } from 'vue';
import { useState } from '@/hooks';
import Deck from '@/data/Deck';
import DisplayInput from '../DisplayInput.vue';

export default {
   name: 'deck-view',

   components: { DisplayInput },

   emits: ['deckOrItemModified', 'handleSave', 'handleDelete'],

   setup(props, { emit }) {
      const [changesMade, setChangesMade] = useState(false);
      const [name, setName] = useState(props.deck.name);
      const [styledName, setStyledName] = useState(props.deck.styledName);
      const [deckCode, setDeckCode] = useState(props.deck.deckCode);
      const [notes, setNotes] = useState(props.deck.notes);

      watch([name, styledName, notes, deckCode], () => {
         if (!changesMade.value) {
            setChangesMade(true);
            emit('deckOrItemModified', true);
         }
      });

      const saveChanges = () => {
         const body = {
            name: name.value,
            styledName: styledName.value,
            deckCode: deckCode.value,
            notes: notes.value,
         };
         setChangesMade(false);
         emit('handleSave', props.deck._id, body);
      };

      const cancelChanges = () => {
         setName(props.deck.name);
         setStyledName(props.deck.styledName);
         setDeckCode(props.deck.deckCode);
         setNotes(props.deck.notes);
         setChangesMade(false);
         emit('deckOrItemModified', false);
      };

      const deleteDeck = () => {
         setChangesMade(false);
         emit('handleDelete', props.deck._id);
      };

      return {
         changesMade,
         setChangesMade,
         saveChanges,
         cancelChanges,
         deleteDeck,

         name,
         setName,
         styledName,
         setStyledName,
         deckCode,
         setDeckCode,
         notes,
         setNotes,
      };
   },

   props: {
      deck: { type: Object, default: () => new Deck() },
   },
};
</script>

<template>
   <div class="global-page deck">
      <div class="data">
         <DisplayInput
            name="name"
            label="Name"
            :value="name"
            @save="setName"
         />
         <DisplayInput
            name="styledName"
            label="Styled Name"
            :value="styledName"
            @save="setStyledName"
         />
         <DisplayInput
            label="Deck Code"
            name="deckCode"
            :value="deckCode"
            @save="setDeckCode"
         />
         <DisplayInput
            textarea
            label="Notes"
            name="notes"
            placeholder="Shift+Enter for new line"
            :value="notes"
            @save="setNotes"
         />

         <section class="battles">
            <div>Wins: {{ deck.wins }}</div>
            <div>Losses: {{ deck.losses }}</div>
         </section>

         <button :disabled="!changesMade" @click="saveChanges">Save Changes</button>
         <button :disabled="!changesMade" @click="cancelChanges">Cancel Changes</button>
         <button @click="deleteDeck">Delete Deck</button>
      </div>
   </div>
</template>

<style lang="scss" scoped>
.deck {
   height: 100%;
   width: 100%;
   display: flex;
   border-left: 1px solid white;
   padding-left: 10px;

   .data {
      width: 100%;
      display: flex;
      flex-direction: column;

      .battles {
         width: 100%;
         height: 60px;
         display: flex;
         justify-content: space-between;
         align-items: center;
         border-radius: 3px;
         padding: 0px 20px;
         cursor: pointer;
         transition: background 0.1s ease-in-out;
         &:hover { background: #fff2; }
      }

      button { background: lightblue; margin-top: 20px; }
   }
}
</style>
