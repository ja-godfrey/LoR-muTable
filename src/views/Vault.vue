<script>
import { computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApi, useAsyncComputed, useState } from '@/hooks';
import DeckInfo from '@/components/vault/DeckInfo.vue';
import DeckList from '@/components/vault/DeckList.vue';
import Deck from '@/data/Deck';

export default {
   name: 'vault',

   components: { DeckInfo, DeckList },

   setup() {
      const router = useRouter();
      const route = useRoute();
      const api = useApi();
      const view = ref('');
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
            || deck.tags.includes(query)
            || champs.includes(query)
            || (deck.regions[0] && deck.regions[0].toLowerCase().includes(query))
            || (deck.regions[1] && deck.regions[1].toLowerCase().includes(query));
      }));

      const [selectedDeck, isLoadingDeck] = useAsyncComputed(async () => {
         if (!route.params.id || route.params.id === 'new') return new Deck();

         const deck = await api.get(`/deck/${route.params.id}`);
         if (!deck) return router.replace('/vault');

         setTimeout(() => {
            view.value = 'view-mobile-info';
         }, 50);
         return deck.data;
      }, {});

      const reopenDeckMobile = id => {
         if (id === route.params.id) view.value = 'view-mobile-info';
      };

      const saveDeck = async (id, body) => {
         let response;

         if (route.params.id === 'new') {
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
         view,
         search,
         unsaved,
         setUnsaved,
         saveDeck,
         deleteDeck,
         filteredDecks,
         selectedDeck,
         isLoadingDeck,

         reopenDeckMobile,
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
               placeholder="Search by name, tags, regions, or champions"
            />

            <router-link class="link" to="/vault">
               <button class="new-deck" :disabled="unsaved" @click="view = 'view-mobile-info'">+ New Deck</button>
            </router-link>
         </div>

         <div class="decks-list">
            <router-link v-for="deck in filteredDecks"
               :key="deck._id"
               :to="`/vault/${deck._id}`"
               :class="['link', 'deck', { selected: deck._id === $route.params.id }]"
               @click="reopenDeckMobile(deck._id)"
            >
               <span>{{ deck.name }}</span>
               <span v-if="deck.favorite">&#10033;</span>
               <span v-else />
            </router-link>
         </div>
      </section>

      <section v-if="!isLoadingDeck" :class="['deck-info-wrapper', view]">
         <DeckInfo
            :deck="selectedDeck"
            @mobileBack="view = ''"
            @mobileForward="view = 'view-mobile-deck'"
            @deckOrItemModified="setUnsaved"
            @handleSave="saveDeck"
            @handleDelete="deleteDeck"
         />

         <DeckList :deckCode="selectedDeck.deckCode" @mobileBack="view = 'view-mobile-info'" />
      </section>
      <section v-else class="deck-info-wrapper loading">
         Loading Deck...
      </section>
   </div>
</template>

<style lang="scss" scoped>
.vault {
   display: grid;
   grid-template-columns: 45% 55%;

   @media (max-width: $media-width) {
      overflow-x: hidden;
      grid-template-columns: 100vw 200vw;
   }

   button:disabled { opacity: 0.5; }

   .decks {
      height: 100%;
      width: 100%;
      padding: 20px;

      .toolbar {
         width: 100%;
         display: flex;
         justify-content: space-between;
         margin-bottom: 10px;

         .new-deck {
            background: $background-alt;
            border: 1px solid $color;
            border-radius: 3px;
            padding: 6px;
            color: $color;
            cursor: pointer;
         }
      }

      .search {
         width: 60%;
      }

      .decks-list {
         $deck-height: 40px;
         width: 100%;
         display: grid;
         grid-template-columns: 1fr 1fr 1fr;
         grid-auto-rows: $deck-height;
         grid-gap: 15px;

         @media (max-width: $media-width) {
            grid-template-columns: 1fr;
         }

         .deck {
            height: $deck-height;
            width: 100%;
            background: $background-alt;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border: 1px solid $color;
            border-radius: 3px;
            padding: 10px;
            transition: box-shadow .15s ease-in-out;
            &.selected { box-shadow: 0px 0px 10px $success; }
         }
      }
   }

   .deck-info-wrapper {
      width: 100%;
      display: flex;
      background: $background-alt;
      border-left: 1px solid black;
      border-radius: 20px 0px 0px 20px;
      box-shadow: -2px 0px 6px #0008;
      transition: transform 0.2s ease-in-out;

      @media (max-width: $media-width) {
         transform: translateX(10px);
         &.view-mobile-info { transform: translateX(-100vw); }
         &.view-mobile-deck { transform: translateX(-200vw); }
      }

      &.loading {
         justify-content: center;
         align-items: center;
      }
   }
}
</style>
