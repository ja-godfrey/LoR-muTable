<script>
import day from 'dayjs';
import mapRegionToIcon from '@/helpers/mapRegionToIcon';

export default {
   name: 'deck-history',

   setup(props) {
      const { version } = props;
      const winData = version.matches.reduce((ratio, match) => {
         const { wins, losses } = ratio;
         return match.outcome === 'win'
            ? { wins: wins + 1, losses }
            : { wins, losses: losses + 1 };
      }, { wins: 0, losses: 0 });
      const wins = winData.losses > 0 && !winData.wins ? 1 : winData.wins;
      const losses = winData.wins > 0 && !winData.losses ? 1 : winData.losses;
      const winDataTotal = (wins / losses) || 0;
      const winRatio = (Math.round(winDataTotal * 100) / 100).toFixed(2);
      const retireDate = day(version.retiredOn).format('DD MMM YYYY');

      const regionIcons = [...props.version.regions].sort().map(region => mapRegionToIcon(region));

      return {
         winRatio,
         retireDate,
         regionIcons,
      };
   },

   props: {
      version: { type: Object, default: () => ({}) },
   },
};
</script>

<template>
   <div class="deck-history-item">
      <div class="row">
         <div class="title">
            <span class="regions">
               <img v-for="(icon, i) in regionIcons" :key="i" :src="icon" />
            </span>
            {{ version.name }}
         </div>
         <span>{{ winRatio }} WR</span>
         <span>{{ retireDate }}</span>
      </div>
      <span v-if="version.champions" class="row small">{{ version.champions.join(' / ') }}</span>
   </div>
</template>

<style lang="scss" scoped>
.deck-history-item {
   width: 100%;
   display: flex;
   flex-direction: column;
   margin-top: 10px;
   border-radius: 3px;
   padding: 6px;
   overflow-wrap: break-word;
   text-align: left;
   cursor: pointer;
   transition: all 0.10s ease-in-out;
   &:hover {
      background: #fff1;
      // box-shadow: 0px 0px 4px #0008;
   }

   .row {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
         display: flex;
         align-items: center;

         .regions {
            display: flex;
            margin-right: 5px;

            img {
               height: 20px;
               width: 20px;
            }
         }
      }
   }

   .small {
      font-size: 11px;
      margin-top: 3px;
   }
}
</style>
