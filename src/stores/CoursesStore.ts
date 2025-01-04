import { shallowRef } from "vue";

const count = shallowRef();
const clean = () => (count.value = undefined);
const store = { count, clean };
export const useCourseCountStore = () => store;
