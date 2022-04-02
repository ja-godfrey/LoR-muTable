<script>
import { usePagination } from '@/hooks';

export default {
   name: 'hero',

   setup() {
      const { pages, heroPage, prevPage, nextPage, setPage } = usePagination(3);

      return {
         pages,
         heroPage,
         prevPage,
         nextPage,
         setPage,
      };
   },
};
</script>

<template>
   <div class="hero">
      <slot />
      <span class="arrow left" @click="prevPage" />
      <span class="arrow right" @click="nextPage" />
      <div class="pagination">
         <span
            v-for="i in pages"
            :key="i"
            :class="['dot', { selected: i === heroPage }]"
            @click="setPage(i)"
         />
      </div>
   </div>
</template>

<style lang="scss" scoped>
.hero {
   height: 200px;
   width: 100%;
   display: flex;
   border: 1px solid white;
   border-radius: 3px;
   position: relative;
   margin-bottom: 60px;

   .arrow {
      height: 40px;
      width: 30px;
      background: black;
      position: absolute;
      top: 50%;
      z-index: 3;
      transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
      cursor: pointer;
      &.left {
         left: 0px;
      }
      &.right {
         right: 0px;
      }
   }

   .pagination {
      width: 100%;
      display: flex;
      justify-content: center;
      position: absolute;
      bottom: -15px;

      .dot {
         height: 10px;
         width: 10px;
         border: 1px solid white;
         border-radius: 50%;
         cursor: pointer;
         &:not(:last-child) {
            margin-right: 4px;
         }
         &.selected {
            background: white;
         }
      }
   }
}
</style>
