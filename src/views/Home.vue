<script>
export default {
   name: 'Home',
};
</script>

<template>
   <div class="global-page home">
      <router-link to="vault?deck=new" class="link">
         <div class="tile">Vault</div>
      </router-link>
   </div>
</template>

<style lang="scss" scoped>
.home {
   display: flex;
   justify-content: center;
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
