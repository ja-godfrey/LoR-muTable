<script>
export default {
   name: 'match-history-item',

   setup() {

   },

   props: {
      match: { type: Object, default: () => ({}) },
   },
};
</script>

<template>
   <div class="match-history-item">
      <div class="row">
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

   .outcome {
      text-transform: uppercase;
      &.win { color: greenyellow; }
      &.loss { color: red; }
   }
}
</style>
