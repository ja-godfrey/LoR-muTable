<script>
import day from 'dayjs';

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
      const winDataTotal = winData.wins / winData.losses;
      const winRatio = (Math.round(winDataTotal * 100) / 100).toFixed(2);
      const retireDate = day(version.retiredOn).format('DD MMM YYYY');

      return {
         winRatio,
         retireDate,
      };
   },

   props: {
      version: { type: Object, default: () => ({}) },
   },
};
</script>

<template>
   <div class="deck-history-item">
      <div class="title">
         <span>{{ version.name }}</span>
         <span>{{ winRatio }} WR</span>
         <span>{{ retireDate }}</span>
      </div>
      <span class="code">{{ version.deckCode }}</span>
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

   .title {
      display: flex;
      justify-content: space-between;
   }

   .code {
      font-size: 11px;
      margin-top: 3px;
   }
}
</style>
