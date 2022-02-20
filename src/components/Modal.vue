<script>
export default {
   name: 'base-modal',

   emits: ['close', 'save'],

   setup(props, { emit }) {
      return {
         handleClose: () => emit('close'),
         handleSave: () => emit('save'),
      };
   },

   props: {
      title: { type: String, default: '' },
      show: { type: Boolean, default: false },
   },
};
</script>

<template>
   <teleport v-if="show" to="#app">
      <div class="modal-wrapper" @click="handleClose">
         <div class="modal" @click="$event.stopPropagation()">
            <div class="title">
               {{ title }}
               <!-- <button class="close" @click="handleClose">&#10006;</button> -->
            </div>
            <div class="body">
               <slot />
               <button class="cancel" @click="handleClose">Cancel</button>
               <button class="save" @click="handleSave">Save</button>
            </div>
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

.modal-wrapper {
   height: 100%;
   width: 100%;
   background: #0006;
   position: absolute;
   top: 0;
   left: 0;
}

.modal {
   width: 600px;
   background: $background-alt;
   border: 1px solid $color;
   border-radius: 3px;
   padding: 10px 20px;
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   -webkit-transform: translate(-50%, -50%);
   box-shadow: 0px 0px 10px #000;

   @media (max-width: $media-width) {
      width: 100%;
   }

   .button {
      background: $background;
      display: flex;
      justify-content: center;
      align-items: center;
      position: absolute;
      box-shadow: 0px 0px 4px #000;
      color: $color;
      cursor: pointer;
   }

   .title {
      height: 40px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      text-transform: uppercase;

      .close {
         @extend .button;
         height: 30px;
         width: 30px;
         border-radius: 50%;
         top: -15px;
         right: 5px;
         &:hover { background: $background-alt; }
      }
   }

   .body {
      .cancel {
         @extend .button;
         height: 30px;
         width: 100px;
         border-radius: 20px;
         bottom: -15px;
         right: 115px;
         &:hover { background: $error; }
         @media (max-width: $media-width) { left: 30px; }
      }

      .save {
         @extend .button;
         height: 30px;
         width: 100px;
         border-radius: 20px;
         bottom: -15px;
         right: 5px;
         &:hover { background: $success; }
         @media (max-width: $media-width) { right: 30px; }
      }
   }
}
</style>
