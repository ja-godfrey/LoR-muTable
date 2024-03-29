<script>
import { ref, watch } from 'vue';
import { useState } from '@/hooks';
import ButtonRow from './TripleButtonRow.vue';

export default {
   name: 'display-input',

   emits: ['save'],

   components: { ButtonRow },

   setup(props, { emit }) {
      const inputRef = ref(null);
      const [editing, setEditing] = useState(false);
      const [changesMade, setChangesMade] = useState(false);
      const [newValue, setNewValue] = useState('');

      // console.log(props, newProps => console.log(newProps));

      watch(newValue, () => {
         if (!changesMade) setChangesMade(true);
      });

      const handleEdit = () => {
         if (props.readonly) return;

         setEditing(true);
         // allow input to render
         setTimeout(() => {
            inputRef.value.focus();
            inputRef.value.selectionStart = inputRef.value.selectionEnd;
         }, 1);
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

      const handleCopy = async () => {
         try {
            await navigator.clipboard.writeText(inputRef.value.value);
            // inputRef.value.selectionStart = inputRef.value.selectionEnd;
         } catch (error) {
            console.log(error);
         }
         handleCancel();
      };

      const handleDown = e => {
         if (!e.shiftKey && e.key === 'Enter') handleSave();
         else if (e.key === 'Escape') handleCancel();
      };

      return {
         inputRef,
         editing,
         setEditing,
         changesMade,
         setChangesMade,
         newValue,
         setNewValue,
         handleDown,
         handleSave,
         handleCancel,
         handleCopy,
         handleEdit,
      };
   },

   props: {
      label: { type: String, default: '' },
      error: { type: [String, Boolean], default: '' },
      name: { type: String, default: '' },
      value: { type: String, default: '' },
      placeholder: { type: String, default: '' },
      textarea: { type: Boolean, default: false },
      readonly: { type: Boolean, default: false },
   },
};
</script>

<template>
   <div class="display-input">
      <div class="label">
         {{ label }}
         <span v-if="error" class="error">- {{ error }}</span>
      </div>

      <div v-if="editing" class="input-wrapper">
         <component :is="textarea ? 'textarea' : 'input'"
            ref="inputRef"
            class="input"
            rows="10"
            :placeholder="placeholder"
            :name="name"
            :value="changesMade ? newValue : value"
            @input="e => setNewValue(e.target.value)"
            @keydown="handleDown"
            @focus="$event.target.select()"
         />
         <ButtonRow class="controls">
            <button v-if="!textarea" class="copy" @click="handleCopy">Copy</button>
            <span v-else /> <!-- placeholder to keep other buttons aligned on right -->
            <template #second><button @click="handleCancel">Cancel</button></template>
            <template #third><button @click="handleSave">Apply</button></template>
         </ButtonRow>
      </div>

      <div v-else
         :name="name"
         :class="['display', { error }]"
         @click="handleEdit"
      >
         {{ value }}
      </div>
   </div>
</template>

<style lang="scss" scoped>
$element-spacing: 4px;

.display-input {
   width: 100%;
   display: flex;
   flex-direction: column;
   margin-bottom: 15px;
   border-radius: 3px;

   .label {
      width: 100%;
      text-align: left;
      margin-bottom: $element-spacing;
      padding-left: 3px;

      .error {
         margin-left: 2px;
         color: $error;
      }
   }

   .container-base {
      min-height: 26px;
      width: 100%;
      background: $background;
      border-radius: 3px;
      padding: 3px;
      color: $color;
      font-size: 13px;
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
         &:focus { border-color:lightskyblue; }
      }

      .controls {
         height: 20px;
         display: flex;
         margin-top: $element-spacing;

         button {
            height: 20px;
            background: $background;
            border: 1px solid $color;
            border-radius: 3px;
            &:last-child { margin-left: 10px; }
            &:not(:first) { margin-right: auto; }
         }

         // .copy { margin-right: auto; }
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

      &.error {
         border-color: $error;
      }
   }
}
</style>
