<template>
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
   background: #323231;
   -webkit-font-smoothing: antialiased;
   -moz-osx-font-smoothing: grayscale;
   text-align: center;
   color: white;
}

.link {
   color: white;
   text-decoration: none;
}

.global-page {
   height: 100%;
   width: 100%;
}
</style>
