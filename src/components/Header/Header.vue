<script>
export default {
   name: 'base-header',
   inject: ['auth'],

   created() {
      console.log(this.auth.user?.sub);
   },
};
</script>

<template>
   <header>
      <router-link to="/" class="link">LoR MU Tables</router-link>
      <button v-if="!auth.authenticated" @click="auth.loginWithPopup()">Log in</button>
      <button v-else @click="auth.logout()">Log out: {{ auth.user?.name }}</button>
   </header>
</template>

<style lang="scss" scoped>
header {
   height: $header-height;
   width: 100%;
   background: #0002;
   display: flex;
   justify-content: space-between;
   align-items: center;
   padding: 0px 20px;
   position: relative;

   button {
      background: $success;
   }
}
</style>
