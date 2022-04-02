<script>
import Hero from '@/components/home/Hero.vue';
import HeroItem from '@/components/home/HeroItem.vue';

export default {
   name: 'Home',

   components: { Hero, HeroItem },
};
</script>

<template>
   <div class="global-page home">
      <Hero>
         <HeroItem left />
         <HeroItem center />
         <HeroItem right />
      </Hero>

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

   .tile {
      height: 300px;
      width: 300px;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid white;
   }
}
</style>
