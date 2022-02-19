<script>
import { ref, watch } from 'vue';
import { useState } from '@/hooks';
import Deck from '@/data/Deck';
import Modal from '../BaseModal.vue';
import DisplayInput from '../DisplayInput.vue';
import MatchHistoryItem from './MatchHistoryItem.vue';
import DeckHistoryItem from './DeckHistoryItem.vue';

export default {
   name: 'deck-view',

   components: { Modal, DisplayInput, MatchHistoryItem, DeckHistoryItem },

   emits: ['deckOrItemModified', 'handleSave', 'handleDelete'],

   setup(props, { emit }) {
      const [changesMade, setChangesMade] = useState(false);
      const showAddMatch = ref(false);
      const tags = ref(props.deck.tags);
      const [name, setName] = useState(props.deck.name);
      const [styledName, setStyledName] = useState(props.deck.styledName);
      const [deckCode, setDeckCode] = useState(props.deck.deckCode);
      const [notes, setNotes] = useState(props.deck.notes);

      watch([tags, name, styledName, notes, deckCode], () => {
         if (!changesMade.value) {
            setChangesMade(true);
            emit('deckOrItemModified', true);
         }
      });

      const addTag = () => {
         const tagName = prompt('Add a tag.');
         const tagExists = tags.value.find(tag => tag.toLowerCase() === tagName.toLowerCase());
         if (tagExists) {
            alert('That tag already exists for this deck.');
         } else if (tagName && !tagName.trim()) {
            alert('Tag cannot be empty.');
         } else if (tagName) {
            tags.value = [...tags.value, tagName.trim().toLowerCase()];
         }
      };

      const removeTag = tagName => {
         tags.value = tags.value.filter(t => t !== tagName);
      };

      const saveChanges = () => {
         const body = {
            name: name.value,
            styledName: styledName.value,
            deckCode: deckCode.value,
            notes: notes.value,
            tags: tags.value,
         };
         setChangesMade(false);
         emit('handleSave', props.deck._id, body);
      };

      const cancelChanges = () => {
         tags.value = props.deck.tags;
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
         showAddMatch,
         addTag,
         removeTag,
         saveChanges,
         cancelChanges,
         deleteDeck,

         tags,
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
      <Modal :show="showAddMatch" />

      <section class="tags">
         <button v-for="tag in tags" :key="tag" class="tag" @click="removeTag(tag)">
            {{ tag }}
         </button>
         <button v-if="tags ? tags.length === 0 : true" @click="addTag">+ tag</button>
         <button v-else @click="addTag">+</button>
         <span v-if="tags ? tags.length <= 2 : true" class="hint">aggro, papercraft, expansion x...</span>
      </section>

      <div class="data row">
         <DisplayInput
            name="name"
            label="Name"
            :value="name"
            :error="!name && 'Required'"
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
            :error="!deckCode && 'Required'"
            @save="setDeckCode"
         />
         <DisplayInput
            textarea
            label="Notes"
            name="notes"
            placeholder="Shift+Enter for new line"
            :value="notes"
            @save="setNotes"
            readonly
         />
      </div>

      <div class="buttons">
         <button class="save" :disabled="!changesMade" @click="saveChanges">Save Changes</button>
         <button :disabled="!changesMade" @click="cancelChanges">Cancel Changes</button>
         <button class="delete" @click="deleteDeck">Delete Deck</button>
      </div>

      <div class="history row">
         <div class="title">
            <h2>Match History</h2>
            <button @click="showAddMatch = !showAddMatch">+</button>
         </div>
         <MatchHistoryItem v-for="match in deck.matches"
            :key="match.id"
            :match="match"
         />
      </div>

      <div class="history row">
         <h2>Deck History</h2>
         <DeckHistoryItem v-for="version in deck.history"
            :key="version.deckCode"
            :version="version"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>

.deck {
   height: 100%;
   width: 70%;
   display: flex;
   flex-direction: column;
   padding: 20px 10px;

   .row {
      width: 100%;
      display: flex;
      flex-direction: column;
   }

   .tags {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 10px;

      button {
         background: $background;
         border: 1px solid lightblue;
         border-radius: 10px;
         color: $color;
         cursor: pointer;
         transition: background .1s ease-in-out;
         &:not(:last-child) { margin-right: 6px; }
         &:hover { background: $success; }
         &.tag:hover { background: $error; }
      }

      .hint {
         height: 100%;
         display: flex;
         align-items: center;
         color: #ccc8;
         font-size: 12px;
      }
   }

   .buttons {
      width: 100%;
      display: flex;

      button {
         height: 24px;
         border: none;
         border-radius: 3px;
         &.save { margin-right: 5px; }
         &.delete { margin-left: auto; }
      }
   }

   .history {
      margin-top: 20px;
      text-align: left;

      .title {
         width: 100%;
         display: flex;

         button { margin-left: auto; }
      }

   }
}
</style>
