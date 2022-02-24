<script>
export default {
   name: 'triple-button-row',
};
</script>

<template>
   <div class="button-row">
      <slot />
      <div class="end">
         <slot name="second" />
         <slot name="third" />
      </div>
   </div>
</template>

<style lang="scss" scoped>
.button-row {
   width: 100%;
   display: flex;
   justify-content: space-between;
   align-items: center;
}
</style>
