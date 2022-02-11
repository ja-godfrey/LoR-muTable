<script>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApi, useAsyncComputed, useState } from '@/hooks';
import DeckInfo from '@/components/vault/DeckInfo.vue';
import DeckList from '@/components/vault/DeckList.vue';
// import Deck from '@/data/Deck';

export default {
   name: 'vault',

   components: { DeckInfo, DeckList },

   setup() {
      const router = useRouter();
      const route = useRoute();
      const api = useApi();
      const decks = ref([]);
      const search = ref('');
      const [unsaved, setUnsaved] = useState(false);

      // eslint-disable-next-line
      (async function() {
         /* get all user decks */
         const response = await api.get('/decks');
         decks.value = response.data;
      })();

      const filteredDecks = computed(() => decks.value.filter(deck => {
         const query = search.value.toLowerCase();
         const champs = deck.champions.map(champ => champ.toLowerCase());

         return deck.name.toLowerCase().includes(query)
            || champs.includes(query)
            || deck.regions[0].toLowerCase().includes(query)
            || deck.regions[1].toLowerCase().includes(query);
      }));

      const [selectedDeck, isLoadingDeck] = useAsyncComputed(() => {
         if (!route.query.deck || route.query.deck === 'new') return {};
         else return api.get(`/deck/${route.query.deck}`).then(response => response.data);
      }, {});

      const saveDeck = async (id, body) => {
         let response;

         if (route.query.deck === 'new') {
            response = await api.post('/decks/new', body);
            decks.value = response.data;
            router.push(`/vault?deck=${response.newId}`);
         } else {
            response = await api.put(`/decks/${id}`, body);
            decks.value = response.data;
         }

         setUnsaved(false);
      };

      const deleteDeck = async id => {
         const confirmed = window.confirm('Are you sure?');
         if (confirmed) {
            try {
               const response = await api.delete(`/decks/${id}`);
               decks.value = response.data;
               router.replace('/vault?deck=new');
            } catch (error) {
               console.log('FAILED TO DELETE');
            }
            setUnsaved(false);
         }
      };

      return {
         search,
         unsaved,
         setUnsaved,
         saveDeck,
         deleteDeck,
         filteredDecks,
         selectedDeck,
         isLoadingDeck,
      };
   },
};
</script>

<template>
   <div class="global-page vault">
      <section class="decks">
         <div class="toolbar">
            <input
               class="search"
               v-model="search"
               placeholder="Search by name, regions, or champs"
            />

            <router-link class="link" to="/vault?deck=new">
               <button class="new-deck" :disabled="unsaved">+ New Deck</button>
            </router-link>
         </div>

         <div class="decks-list">
            <router-link v-for="deck in filteredDecks"
               :key="deck._id"
               :to="`/vault?deck=${deck._id}`"
               class="link deck"
            >
               {{ deck.name }}
            </router-link>
         </div>
      </section>

      <DeckInfo v-if="$route.query.deck && !isLoadingDeck"
         :deck="selectedDeck"
         @deckOrItemModified="setUnsaved"
         @handleSave="saveDeck"
         @handleDelete="deleteDeck"
      />
      <div v-else-if="isLoadingDeck">Loading...</div>

      <DeckList v-if="selectedDeck.deckCode && !isLoadingDeck"
         :deckCode="selectedDeck.deckCode"
      />
      <div v-else-if="isLoadingDeck">Loading...</div>
   </div>
</template>

<style lang="scss" scoped>
.vault {
   display: grid;
   grid-template-columns: 40% 40% 20%;
   gap: 10px;
   padding: 40px 20px;

   button:disabled { opacity: 0.5; }

   .decks {
      height: 100%;
      width: 100%;

      .toolbar {
         width: 100%;
         display: flex;
         justify-content: space-between;
         margin-bottom: 10px;

         .new-deck {
            background: none;
            border: none;
            border: 1px solid white;
            border-radius: 3px;
            padding: 6px;
            color: white;
            cursor: pointer;
         }
      }

      .search {
         width: 60%;
      }

      .decks-list {
         $deck-height: 40px;
         height: 100%;
         width: 100%;
         display: grid;
         grid-template-columns: 1fr 1fr 1fr;
         grid-auto-rows: $deck-height;
         grid-gap: 15px;

         .deck {
            height: $deck-height;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            border: 1px solid white;
            border-radius: 3px;
            padding: 10px;
         }
      }
   }
}
</style>
