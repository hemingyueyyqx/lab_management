import { shallowRef } from "vue";

const labtable = shallowRef();
const clean = () => (labtable.value = undefined);
const store = { labtable, clean };
export const useLabTableStore = () => store;