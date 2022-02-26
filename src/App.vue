<script>
import Header from '@/components/Header/Header.vue';

export default {
   name: 'app',

   components: { Header },
};
</script>

<template>
   <Header />
   <router-view/>
</template>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans&display=swap');

* {
   font-family: 'Noto Sans', sans-serif;
}

#app {
   height: 100vh;
   min-height: 100vh;
   background: $background;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-align: center;
   color: $color;
}

.link {
   color: $color;
   text-decoration: none;
}

.global-page {
   height: calc(100% - #{$header-height});
   width: 100%;
}

button {
   color: $color;
   border: 1px solid $color;
   border-radius: 3px;
   box-shadow: 0px 0px 4px #000;
   cursor: pointer;
   transition: all 0.1s ease-in-out;
   &:disabled {
      opacity: 0.5;
      cursor: default;
   }
}
</style>
