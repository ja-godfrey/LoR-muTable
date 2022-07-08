<script>
import { ref } from 'vue';
// import Hero from '@/components/home/Hero.vue';
// import HeroItem from '@/components/home/HeroItem.vue';
import Button from '@/components/Button.vue';

export default {
   name: 'Home',

   components: {
      // Hero,
      // HeroItem,
      Button,
   },

   setup() {
      const champs = ref('');

      return {
         champs,
      };
   },
};
</script>

<template>
   <div class="global-page home">
      <!-- <Hero>
         <HeroItem left />
         <HeroItem center />
         <HeroItem right />
      </Hero> -->

      <section class="top-champs">
         <div>Find top decks with your favorite champs</div>
         <div class="search">
            <input v-model="champs" placeholder="Champion name" />
            <Button>Search</Button>
         </div>
      </section>

      <router-link to="vault" class="link">
         <div class="tile">Vault</div>
      </router-link>
   </div>
</template>

<style lang="scss" scoped>
.home {
   padding: 40px 200px 0px 200px;
   display: flex;
   flex-direction: column;
   align-items: center;

   .top-champs {
      margin-bottom: 40px;

      .search {
         width: 100%;
         display: flex;
         margin-top: 10px;
         input {
            width: 100%;
            margin-right: 3px;
         }
      }
   }

   .tile {
      height: 300px;
      width: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid white;
      border-radius: 3px;
   }
}
</style>
