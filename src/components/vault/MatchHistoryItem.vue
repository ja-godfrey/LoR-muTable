<script>
import mapRegionToIcon from '@/helpers/mapRegionToIcon';

export default {
   name: 'match-history-item',

   setup({ match }) {
      /* spread to prevent reassigning of prop */
      const regionIcons = [...match.enemyRegions].sort().map(region => mapRegionToIcon(region));
      const champs = [...match.enemyChamps].sort().join(' / ');

      return { regionIcons, champs };
   },

   props: {
      match: { type: Object, default: () => ({}) },
   },
};
</script>

<template>
   <div class="match-history-item">
      <div class="row">
         <span class="regions">
            <img v-for="(icon, i) in regionIcons" :key="i" class="region-icon" :src="icon" />
         </span>
         <span>{{ champs }}</span>
         <span :class="['outcome', match.outcome]">{{ match.outcome }}</span>
      </div>
   </div>
</template>

<style lang="scss" scoped>
.match-history-item {
   width: 100%;
   display: flex;
   flex-direction: column;
   border-radius: 3px;
   padding: 6px;
   &:hover { background: #fff1; }

   .row {
      display: flex;
      align-items: center;
   }

   .regions {
      width: 50px;
      margin-right: 10px;

      .region-icon {
         height: 24px;
         width: 24px;
      }
   }

   .outcome {
      text-transform: uppercase;
      margin-left: auto;
      &.win { color: greenyellow; }
      &.loss { color: red; }
   }
}
</style>
