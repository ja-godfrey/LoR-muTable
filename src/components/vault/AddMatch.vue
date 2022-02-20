<script>
import { ref } from 'vue';
import MultiSelect from '@vueform/multiselect';
import { champions as champNames } from '@/data/sets';
import globals from '@/data/core/globals-en_us.json';

const optionSets = {
   outcomes: [
      { name: 'Win', value: 'win' },
      { name: 'Loss', value: 'loss' },
   ],
   initiatives: [
      { name: 'You started (attack on odds)', value: 0 },
      { name: 'Opponent started (attack on evens)', value: 1 },
   ],
   regions: globals.regions.map(region => region.name).sort(),
   champions: champNames,
};

export default {
   name: 'add-match',

   components: { MultiSelect },

   setup() {
      const outcome = ref('');
      const initiative = ref('');
      const regions = ref([]);
      const champions = ref([]);
      const notes = ref('');

      const createMultipleDisplay = options => options.map(item => item.value).join(', ');

      const test = value => console.log(value);

      return {
         optionSets,
         test,

         outcome,
         initiative,
         regions,
         champions,
         notes,
         createMultipleDisplay,
      };
   },
};
</script>

<template>
   <label>Outcome</label>
   <MultiSelect
      class="multiselect"
      label="name"
      :options="optionSets.outcomes"
      @change="v => outcome = v"
   />

   <label>Initiative</label>
   <MultiSelect
      class="multiselect"
      label="name"
      :options="optionSets.initiatives"
      @change="v => initiative = v"
   />

   <label>Regions</label>
   <MultiSelect
      class="multiselect"
      mode="tags"
      :options="optionSets.regions"
      :closeOnSelect="false"
      :multipleLabel="createMultipleDisplay"
      @change="v => regions = v"
      searchable
   />

   <label>Champions</label>
   <MultiSelect
      class="multiselect"
      mode="tags"
      :options="optionSets.champions"
      :closeOnSelect="false"
      :multipleLabel="createMultipleDisplay"
      @change="v => champions = v"
      searchable
   />

   <label>Notes</label>
   <textarea v-model="notes" rows="6" />
</template>

<style lang="scss" scoped>
label {
   width: 100%;
   margin-bottom: 4px;
   display: flex;
}

input, textarea {
   width: 100%;
   margin-bottom: 20px;
}

.multiselect {
   margin-bottom: 20px;
   color: $background;
}
</style>
