<script>
export default {
   name: 'Home',

   async created() {
      console.log('created');
      // try {
      //    const data = await ky.get('https://americas.api.riotgames.com/lor/ranked/v1/leaderboards', {
      //       headers: { 'X-Riot-Token': process.env.VUE_RIOT_TOKEN },
      //    }).json();
      //    console.log(data);
      // } catch (error) {
      //    console.log(error);
      // }
   },
};
</script>

<template>
   <div class="home">
      <img alt="Vue logo" src="../assets/logo.png">
   </div>
</template>
