import { shallowRef } from "vue";

const labs = shallowRef();
const clear = () => (labs.value = undefined);
const store = { labs, clear };
export const useLabsStore = () => store;