import { ref, reactive, readonly, watch } from 'vue';

export default function useState(initState) {
   const state = typeof initState === 'object'
      ? reactive(initState)
      : ref(initState);
   const setState = newState => { state.value = newState; };
   const hasBeenModified = ref(false);

   watch(state, () => {
      if (!hasBeenModified.value) {
         hasBeenModified.value = true;
      }
   });

   return [readonly(state), setState, readonly(hasBeenModified)];
}
