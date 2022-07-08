<script>
import { computed, toRef } from 'vue';
import orderBy from 'lodash/orderBy';
import { DeckEncoder } from 'runeterra';
import cards from '@/data/sets';
import mapRegionToIcon from '@/helpers/mapRegionToIcon';

export default {
   name: 'deck-list',

   emits: ['mobile-back'],

   setup(props) {
      const regions = toRef(props, 'deckRegions');
      const deckList = computed(() => props.deckCode ? DeckEncoder.decode(props.deckCode).map(summary => {
         console.log(summary);
         const card = cards.find(c => c.cardCode === summary.code);
         return {
            name: card.name,
            cost: card.cost,
            region: card.regions[0].split(' ').join('-'),
            champ: card.supertype === 'Champion',
            count: summary.count,
            code: summary.code,
         };
      }) : []);

      const sortedList = orderBy(deckList.value, ['cost', 'name'], 'asc');
      const regionIcons = regions.value.sort().map(region => mapRegionToIcon(region));

      return {
         deckList: sortedList,
         regionIcons,
      };
   },

   props: {
      deckCode: { type: String, default: '' },
      deckRegions: { type: Array, default: () => ([]) },
   },
};
</script>

<template>
   <div v-if="deckList" class="deck-list">
      <span class="back" @click="$emit('mobile-back')">BACK</span>

      <span class="regions">
         <img v-for="(icon, i) in regionIcons" :key="i" :src="icon" />
      </span>

      <a v-for="card in deckList"
         :key="card.code"
         :class="['card', 'link', card.region.replace('&', 'and')]"
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
   height: 100%;
   max-height: 100%;
   width: 30%;
   display: flex;
   flex-direction: column;
   padding: 20px 10px;
   overflow-y: auto;

   .back {
      width: 100%;
      margin-bottom: 20px;
      display: none;
   }

   @media (max-width: $media-width) {
      width: 100vw;
      .back { display: flex; }
   }

   .regions {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;

      img {
         height: 30px;
         width: 30px;
      }
   }

   .card {
      $card-height: 30px;

      @media (max-width: $media-width) {
         $card-height: 40px;
      }

      width: 100%;
      height: $card-height;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 3px;
      border: 1px solid;
      border-radius: 3px;
      font-size: 12px;
      text-align: left;
      &.Bandle-City {
         border-color: $Bandle-City;
         background: linear-gradient(to right, $background, $Bandle-City);
      }
      &.Bilgewater {
         border-color: $Bilgewater;
         background: linear-gradient(to right, $background, $Bilgewater);
      }
      &.Demacia {
         border-color: $Demacia;
         background: linear-gradient(to right, $background, $Demacia);
         .count{ color: black !important; }
      }
      &.Freljord {
         border-color: $Freljord;
         background: linear-gradient(to right, $background, $Freljord);
      }
      &.Ionia {
         border-color: $Ionia;
         background: linear-gradient(to right, $background, $Ionia);
      }
      &.Noxus {
         border-color: $Noxus;
         background: linear-gradient(to right, $background, $Noxus);
      }
      &.Piltover-and-Zaun {
         border-color: $Piltover-and-Zaun;
         background: linear-gradient(to right, $background, $Piltover-and-Zaun);
      }
      &.Shadow-Isles {
         border-color: $Shadow-Isles;
         background: linear-gradient(to right, $background, $Shadow-Isles);
      }
      &.Shurima {
         border-color: $Shurima;
         background: linear-gradient(to right, $background, $Shurima);
      }
      &.Targon {
         border-color: $Targon;
         background: linear-gradient(to right, $background, $Targon);
      }
      &.Runeterra {
         border-color: $Runeterra;
         background: linear-gradient(to right, $background, $Runeterra);
      }

      @media (max-width: $media-width) {
         font-size: 16px;
      }

      .number {
         min-height: $card-height;
         min-width: $card-height;
         display: flex;
         justify-content: center;
         align-items: center;
      }

      .cost-name {
         display: flex;
         align-items: center;

         .cost {
            @extend .number;
            background: $background;
            border: 2px outset $btn-hover;
            border-radius: 50%;
            margin-right: 5px;
         }

         .name.champ { color: gold; }
      }

      .count {
         @extend .number;
         font-size: 14px;
         -webkit-text-stroke: .3px black;
      }
   }
}
</style>
