<script>
import { computed, ref, toRef, watch } from 'vue';
import { useState } from '@/hooks';
import Deck from '@/data/Deck';
import Button from '../Button.vue';
import Modal from '../Modal.vue';
import AddMatch from './AddMatch.vue';
import DisplayInput from '../DisplayInput.vue';
import ButtonRow from '../TripleButtonRow.vue';
import MatchHistoryItem from './MatchHistoryItem.vue';
import DeckHistoryItem from './DeckHistoryItem.vue';

export default {
   name: 'deck-view',

   components: {
      Button,
      Modal,
      AddMatch,
      ButtonRow,
      DisplayInput,
      MatchHistoryItem,
      DeckHistoryItem,
   },

   emits: ['mobile-back', 'mobile-forward', 'deckOrItemModified', 'handleSave', 'handleDelete', 'addMatch'],

   setup(props, { emit }) {
      const addMatchRef = ref(null);

      const deck = toRef(props, 'deckData');
      const initDeckCode = computed(() => deck.value._id ? deck.value.deckCode : '');
      const [changesMade, setChangesMade] = useState(false);
      const showAddMatch = ref(false);

      const matches = deck.value.matches
         ? deck.value.matches.sort((a, b) => new Date(b.date) - new Date(a.date))
         : [];

      watch(
         () => [deck.value.name, deck.value.styledName, deck.value.deckCode, deck.value.notes, deck.value.tags, deck.value.favorite],
         () => {
            if (!changesMade.value) {
               setChangesMade(true);
               emit('deckOrItemModified', true);
            }
         },
      );

      const addTag = () => {
         const tagName = prompt('Add a tag.');
         if (!tagName) return;

         const tagExists = deck.value.tags.find(tag => tag.toLowerCase() === tagName.toLowerCase());
         if (tagExists) {
            alert('That tag already exists for this deck.');
         } else if (tagName && !tagName.trim()) {
            alert('Tag cannot be empty.');
         } else {
            deck.value.tags = [...deck.value.tags, tagName.trim().toLowerCase()];
         }
      };

      const removeTag = tagName => {
         deck.value.tags = deck.value.tags.filter(t => t !== tagName);
      };

      const saveChanges = () => {
         if (initDeckCode.value !== '' && deck.value.deckCode !== initDeckCode.value) {
            const confirmed = window.confirm('This will retire your current deck into this deck\'s history. Continue?');
            if (!confirmed) return;
         }

         const body = {
            name: deck.value.name,
            styledName: deck.value.styledName,
            deckCode: deck.value.deckCode,
            notes: deck.value.notes,
            tags: deck.value.tags,
            favorite: deck.value.favorite,
         };
         setChangesMade(false);
         emit('handleSave', props.deckData._id, body);
      };

      const deleteDeck = () => {
         setChangesMade(false);
         emit('handleDelete', props.deckData._id);
      };

      const addMatch = async () => {
         const {
            outcome, type, initiative, regions, champions, notes: matchNotes,
         } = addMatchRef.value;

         if (!outcome
            || type === null
            || initiative === null
            || regions.length <= 0
            || regions.length > 2
            || champions.length < 0
            || champions.length > 6
         ) {
            alert('Please make sure all required fields are filled correctly');
            return;
         }

         emit('addMatch', props.deckData._id, {
            outcome, type, initiative, enemyRegions: regions, enemyChamps: champions, notes: matchNotes,
         });
         showAddMatch.value = false;
      };

      return {
         addMatchRef,
         addMatch,

         deck,
         matches,
         changesMade,
         setChangesMade,
         showAddMatch,
         addTag,
         removeTag,
         saveChanges,
         deleteDeck,
      };
   },

   props: {
      deckData: { type: Object, default: () => new Deck() },
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
         <Button v-if="deckData._id" @click="deleteDeck" error>Delete Deck</Button>
         <span v-else />
         <template #third>
            <Button :disabled="!changesMade" @click="saveChanges" success>
               {{ deckData._id ?  'Save Changes' : 'Create Deck' }}
            </Button>
         </template>
      </ButtonRow>

      <section v-if="deckData._id" class="tags">
         <button v-for="tag in deck.tags" :key="tag" class="tag" @click="removeTag(tag)">
            {{ tag }}
         </button>
         <button v-if="deck.tags ? deck.tags.length === 0 : true" @click="addTag">+ tag</button>
         <button v-else @click="addTag">+</button>
         <span v-if="deck.tags ? deck.tags.length <= 2 : true" class="hint">aggro, dragons, expansion x...</span>
      </section>

      <div class="data row">
         <DisplayInput
            name="name"
            label="Name"
            :value="deck.name"
            :error="!deck.name && 'Required'"
            @save="v => deck.name = v"
         />
         <DisplayInput
            name="styledName"
            label="Styled Name"
            :value="deck.styledName"
            @save="v => deck.styledName = v"
         />
         <DisplayInput
            label="Deck Code"
            name="deckCode"
            :value="deck.deckCode"
            :error="!deck.deckCode && 'Required'"
            @save="v => deck.deckCode = v"
         />
         <DisplayInput
            textarea
            label="Notes"
            name="notes"
            placeholder="Shift+Enter for new line"
            :value="deck.notes"
            @save="v => deck.notes = v"
         />
         <span class="checkbox-wrapper">
            <input id="favorite" type="checkbox" :checked="deck.favorite" @input="deck.favorite = !deck.favorite" />
            <label for="favorite">Favorite</label>
         </span>
      </div>

      <div v-if="deck._id" class="history row">
         <div class="title">
            <h2>Match History</h2>
            <button @click="showAddMatch = !showAddMatch">+</button>
         </div>
         <MatchHistoryItem v-for="match in matches"
            :key="match.id"
            :match="match"
         />
      </div>

      <div v-if="deck._id" class="history row">
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
      // overflow-y: auto;

      .title {
         width: 100%;
         display: flex;

         button {
            height: 20px;
            width: 20px;
            background: $background;
            border-radius: 50%;
            margin-left: auto;
            &:hover { background: $success; }
         }
      }

   }
}
</style>
