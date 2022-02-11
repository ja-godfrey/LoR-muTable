<script>
import { ref, watch } from 'vue';
import { useState } from '@/hooks';

export default {
   name: 'display-input',

   emits: ['save'],

   setup(props, { emit }) {
      const inputRef = ref(null);
      const [editing, setEditing] = useState(false);
      const [changesMade, setChangesMade] = useState(false);
      const [newValue, setNewValue] = useState('');

      watch(newValue, () => {
         if (!changesMade) setChangesMade(true);
      });

      const handleEdit = () => {
         setEditing(true);
         // allow input to render
         setTimeout(() => inputRef.value.focus(), 1);
      };

      const handleCancel = () => {
         setEditing(false);
         setChangesMade(false);
         setNewValue(null);
      };

      const handleSave = () => {
         emit('save', newValue.value);
         handleCancel();
      };

      const handleEnter = e => {
         if (!e.shiftKey && e.key === 'Enter') handleSave();
      };

      return {
         inputRef,
         editing,
         setEditing,
         changesMade,
         setChangesMade,
         newValue,
         setNewValue,
         handleEnter,
         handleSave,
         handleCancel,
         handleEdit,
      };
   },

   props: {
      label: { type: String, default: '' },
      name: { type: String, default: '' },
      value: { type: String, default: '' },
      placeholder: { type: String, default: '' },
      textarea: { type: Boolean, default: false },
   },
};
</script>

<template>
   <div class="display-input">
      <div class="label">{{ label }}</div>

      <div v-if="editing" class="input-wrapper">
         <component :is="textarea ? 'textarea' : 'input'"
            ref="inputRef"
            class="input"
            rows="10"
            :placeholder="placeholder"
            :name="name"
            :value="changesMade ? newValue : value"
            @input="e => setNewValue(e.target.value)"
            @keypress="handleEnter"
         />
         <div class="controls">
            <button @click="handleSave">Save</button>
            <button @click="handleCancel">Cancel</button>
         </div>
      </div>

      <div v-else class="display" :name="name" @click="handleEdit">{{ value }}</div>
   </div>
</template>

<style lang="scss" scoped>
$element-spacing: 3px;

.display-input {
   width: 100%;
   display: flex;
   flex-direction: column;
   margin-bottom: 15px;
   // border-left: 1px solid white;
   border-radius: 3px;
   // padding: 3px 0px 3px 3px;

   .label {
      width: 100%;
      text-align: left;
      margin-bottom: $element-spacing;
      padding-left: 3px;
   }

   .container-base {
      min-height: 26px;
      width: 100%;
      background: #212121;
      border-radius: 3px;
      padding: 3px;
      color: white;
   }

   .input-wrapper {
      width: 100%;
      display: flex;
      flex-direction: column;

      .input {
         @extend .container-base;
         border: none;
         outline: none;
         border: 1px solid transparent;
         font-size: 14px;
         &:focus { border-color:lightskyblue; }
      }

      .controls {
         height: 20px;
         display: flex;
         justify-content: flex-start;
         margin-top: $element-spacing;
      }
   }

   .display {
      @extend .container-base;
      width: 100%;
      display: flex;
      align-items: center;
      border: 1px solid transparent;
      text-align: left;
      line-height: 120%;
      white-space: pre;
      overflow: hidden;
      cursor: text;
   }
}
</style>
