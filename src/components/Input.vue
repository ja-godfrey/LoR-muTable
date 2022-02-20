<script>
export default {
   name: 'base-input',

   setup(props, { emit }) {
      const handleInput = ({ target: { value } }) => {
         emit('input', value);
      };

      return { handleInput };
   },

   props: {
      label: { type: String, default: '' },
      value: { type: String, default: '' },
   },
};
</script>

<template>
   <div class="input-wrapper">
      <label for="input">{{ label }}</label>
      <input id="input" :value="value" @input="handleInput" />
   </div>
</template>

<style lang="scss">
.input-wrapper {
   width: 100%;
   display: flex;
   flex-direction: column;
   margin-bottom: 20px;

   label {
      width: 100%;
      margin-bottom: 4px;
      text-align: left;
   }

   input {
      width: 100%;
   }
}
</style>
