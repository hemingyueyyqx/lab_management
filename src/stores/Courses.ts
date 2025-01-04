import { shallowRef } from "vue";

const count = shallowRef();
const clear = () => (count.value = undefined);
const store = { count, clear };
export const useCourseCountStore = () => store;