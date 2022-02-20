<script>
import { ref, watch } from 'vue';
import { useApi, useState } from '@/hooks';
import Deck from '@/data/Deck';
import Modal from '../Modal.vue';
import AddMatch from './AddMatch.vue';
import DisplayInput from '../DisplayInput.vue';
import ButtonRow from '../TripleButtonRow.vue';
import MatchHistoryItem from './MatchHistoryItem.vue';
import DeckHistoryItem from './DeckHistoryItem.vue';

export default {
   name: 'deck-view',

   components: {
      Modal,
      AddMatch,
      ButtonRow,
      DisplayInput,
      MatchHistoryItem,
      DeckHistoryItem,
   },

   emits: ['mobile-back', 'mobile-forward', 'deckOrItemModified', 'handleSave', 'handleDelete'],

   setup(props, { emit }) {
      const api = useApi();
      const addMatchRef = ref(null);

      const [changesMade, setChangesMade] = useState(false);
      const showAddMatch = ref(false);
      const tags = ref(props.deck.tags);
      const [name, setName] = useState(props.deck.name);
      const [styledName, setStyledName] = useState(props.deck.styledName);
      const [deckCode, setDeckCode] = useState(props.deck.deckCode);
      const [notes, setNotes] = useState(props.deck.notes);
      const [favorite, setFavorite] = useState(props.deck.favorite);

      watch([tags, name, styledName, notes, deckCode, favorite], () => {
         if (!changesMade.value) {
            setChangesMade(true);
            emit('deckOrItemModified', true);
         }
      });

      const addTag = () => {
         const tagName = prompt('Add a tag.');
         if (!tagName) return;

         const tagExists = tags.value.find(tag => tag.toLowerCase() === tagName.toLowerCase());
         if (tagExists) {
            alert('That tag already exists for this deck.');
         } else if (tagName && !tagName.trim()) {
            alert('Tag cannot be empty.');
         } else {
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
            favorite: favorite.value,
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

      const addMatch = async () => {
         const {
            outcome, initiative, regions, champions, notes: matchNotes,
         } = addMatchRef.value;

         if (!outcome
            || initiative === null
            || regions.length <= 0
            || regions.length > 2
            || champions.length < 0
            || champions.length > 6
         ) {
            alert('Please make sure all required fields are filled correctly');
            return;
         }

         try {
            await api.post(`/decks/${props.deck._id}/match`, {
               outcome,
               initiative,
               enemyRegions: regions,
               enemyChamps: champions,
               notes: matchNotes,
            });
         } catch (error) {
            console.log(error);
         }
         showAddMatch.value = false;
      };

      return {
         addMatchRef,
         addMatch,

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
         favorite,
         setFavorite,
      };
   },

   props: {
      deck: { type: Object, default: () => new Deck() },
   },
};
</script>

<template>
   <div class="global-page deck">
      <Modal
         title="Add Match"
         :show="showAddMatch"
         @close="showAddMatch = false"
         @save="addMatch"
      >
         <AddMatch ref="addMatchRef" />
      </Modal>

      <span class="back">
         <span @click="$emit('mobile-back')">BACK</span>
         <span @click="$emit('mobile-forward')">DECK</span>
      </span>

      <ButtonRow class="buttons">
         <button class="delete" @click="deleteDeck">Delete Deck</button>
         <template #second><button :disabled="!changesMade" @click="cancelChanges">Cancel Changes</button></template>
         <template #third><button class="save" :disabled="!changesMade" @click="saveChanges">Save Changes</button></template>
      </ButtonRow>

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
         />
         <span class="checkbox-wrapper">
            <input id="favorite" type="checkbox" :checked="favorite" @input="setFavorite(!favorite)" />
            <label for="favorite">Favorite</label>
         </span>
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
   padding: 20px 0px;
   padding-left: 10px;

   .back {
      width: 100%;
      margin-bottom: 20px;
      display: none;
      justify-content: space-between;
   }

   @media (max-width: $media-width) {
      width: 100vw;
      padding-right: 10px;

      .back { display: flex; }
   }

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
         border: 2px outset #adadad;
         border-radius: 10px;
         cursor: pointer;
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

   .data {
      .checkbox-wrapper {
         height: 20px;
         width: 100%;
         display: flex;
         align-items: center;

         input { margin-right: 10px; }
         label { font-size: 12px; }
      }
   }

   .buttons {
      width: 100%;
      display: flex;
      margin-bottom: 20px;

      button {
         height: 24px;
         background: $background;
         border-radius: 3px;
         &.delete { background: $error; }
         &.save { margin-left: 10px; background: $success; }
      }
   }

   .history {
      margin-top: 20px;
      text-align: left;

      .title {
         width: 100%;
         display: flex;

         button {
            height: 24px;
            width: 24px;
            background: $background;
            border-radius: 50%;
            margin-left: auto;
            &:hover { background: $success; }
         }
      }

   }
}
</style>
