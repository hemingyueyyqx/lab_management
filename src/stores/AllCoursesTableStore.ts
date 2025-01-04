import { shallowRef } from "vue";

const allCoursesTable = shallowRef();
const clean = () => (allCoursesTable.value = undefined);
const store = { allCoursesTable, clean };
export const useAllCoursesTableStore = () => store;
