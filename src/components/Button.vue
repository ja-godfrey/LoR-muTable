<script>
export default {
   name: 'base-button',

   setup() {

   },

   props: {
      style: { type: Object, default: () => ({}) },
      primary: { type: Boolean, default: true },
      secondary: { type: Boolean, default: false },
      success: { type: Boolean, default: false },
      error: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
   },
};
</script>

<template>
   <button :class="{ primary, secondary, success, error, disabled }" :disabled="disabled" :style="style">
      <slot />
   </button>
</template>

<style lang="scss" scoped>
button {
   border: 1px solid $color;
   border-radius: 3px;
   color: $color;
   box-shadow: 0px 0px 4px #000;
   cursor: pointer;
   transition: all 0.1s ease-in-out;
   &:hover { background: $btn-hover; }
   &.primary {
      background: $background-alt;
      &.success { background: $success; }
      &.error { background: $error; }
   }
   &.secondary {
      background: $background;
      &.success:hover { background: $success; }
      &.error:hover { background: $error; }
   }
   &.disabled {
      opacity: 0.5;
      cursor: default;
   }
}
</style>
