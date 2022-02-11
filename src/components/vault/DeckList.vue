<script>
import { computed } from 'vue';
import orderBy from 'lodash/orderBy';
import { DeckEncoder } from 'runeterra';
import cards from '@/data/sets';

export default {
   name: 'deck-list',

   setup(props) {
      const deckList = computed(() => DeckEncoder.decode(props.deckCode).map(summary => {
         const card = cards.find(c => c.cardCode === summary.code);
         return {
            name: card.name,
            cost: card.cost,
            region: card.regions[0].split(' ').join('-'),
            champ: card.supertype === 'Champion',
            count: summary.count,
            code: summary.code,
         };
      }));

      const sortedList = orderBy(deckList.value, ['cost', 'name'], 'asc');

      return { deckList: sortedList };
   },

   props: {
      deckCode: { type: String, default: '' },
   },
};
</script>

<template>
   <div v-if="deckList" class="deck-list">
      <a v-for="card in deckList"
         :key="card.code"
         :class="['card', 'link', card.region]"
         :href="`https://lor.mobalytics.gg/cards/${card.code}`"
         target="__blank"
      >
         <div class="cost-name">
            <span class="cost">{{ card.cost }}</span>
            <span :class="['name', { champ: card.champ }]">{{ card.name }}</span>
         </div>
         <span class="count">{{ card.count }}</span>
      </a>
   </div>
</template>

<style lang="scss" scoped>
.deck-list {
   width: 100%;
   display: flex;
   flex-direction: column;
   padding: 0px 3px;

   .card {
      $card-height: 30px;
      width: 100%;
      height: $card-height;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
      border: 1px solid white;
      border-radius: 3px;
      font-size: 12px;
      &.Freljord {
         border-color: $Freljord;
         .count { background: linear-gradient(to right, transparent, $Freljord); }
      }
      &.Noxus {
         border-color: $Noxus;
         .count { background: linear-gradient(to right, transparent, $Noxus); }
      }
      &.Shadow-Isles {
         border-color: $Shadow-Isles;
         .count { background: linear-gradient(to right, transparent, $Shadow-Isles); }
      }
      &.Shurima {
         border-color: $Shurima;
         .count { background: linear-gradient(to right, transparent, $Shurima); }
      }

      .number {
         height: $card-height;
         width: $card-height;
         display: flex;
         justify-content: center;
         align-items: center;
      }

      .cost-name {
         display: flex;
         align-items: center;

         .cost {
            @extend .number;
            border: 1px solid white;
            border-radius: 50%;
            margin-right: 5px;
         }

         .name.champ { color: gold; }
      }

      .count {
         @extend .number;
         background: linear-gradient(to right, transparent, tan);
      }
   }
}
</style>
