<script>
export default {
   name: 'base-modal',

   emits: ['close'],

   setup() {

   },

   props: {
      title: { type: String, default: '' },
      show: { type: Boolean, default: false },
   },
};
</script>

<template>
   <teleport v-if="show" to="#app">
      <div class="modal">
         <div class="title">
            {{ title }}
            <span class="close" @click="$emit('close')">X</span>
         </div>
      </div>
   </teleport>
</template>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.modal {
   height: 400px;
   width: 600px;
   background: $background;
   border: 1px solid #aaa;
   border-radius: 3px;
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   -webkit-transform: translate(-50%, -50%);
   box-shadow: 0px 0px 8px #000;

   .title {
      height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      border-bottom: 1px solid black;
      padding: 0px 20px;

      .close {
         margin-left: auto;
      }
   }
}
</style>
