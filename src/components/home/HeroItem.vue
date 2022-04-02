<script>
export default {
   name: 'hero-item',

   props: {
      deck: { type: String, default: '' },
      left: { type: Boolean, default: false },
      center: { type: Boolean, default: false },
      right: { type: Boolean, default: false },
   },
};
</script>

<template>
   <div :class="['hero-item', { left, center, right }]" />
</template>

<style lang="scss" scoped>
.hero-item {
   height: 100%;
   position: absolute;
   top: 0px;
   &.left {
      width: 38%;
      background: lightblue;
      left: 0px;
      z-index: 2;
      clip-path: polygon(0 0, 100% 0, 67.8% 100%, 0% 100%);
      -webkit-clip-path: polygon(0 0, 100% 0, 67.8% 100%, 0% 100%);
   }
   &.center {
      width: 50%;
      background: lightcoral;
      left: 50%;
      transform: translateX(-50%);
   }
   &.right {
      width: 38%;
      background: lightgreen;
      left: 62%;
      z-index: 2;
      clip-path: polygon(32.2% 0, 100% 0, 100% 100%, 0% 100%);
      -webkit-clip-path: polygon(32.2% 0, 100% 0, 100% 100%, 0% 100%);
   }
}
</style>
