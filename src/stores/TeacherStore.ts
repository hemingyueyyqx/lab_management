import { shallowRef } from "vue";
import { type Course } from "@/types/index";

// 该老师的全部课程
const coursesS = shallowRef<Course[]>();
const clear = () => (coursesS.value = undefined);
const store = { coursesS, clear };
export const useCoursesStore = () => store;
