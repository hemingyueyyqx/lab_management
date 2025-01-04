import { shallowRef } from "vue";

const coursesTable = shallowRef();
const clean = () => (coursesTable.value = undefined);
const store = { coursesTable, clean };
export const useCoursesTableCountStore = () => store;
