import type { User } from "@/types/index";
import { ADMIN, TEACHER, LABADMIN } from "@/services/Const";
import { shallowRef } from "vue";
const setUserSessionStorage = (user: User, role: string, idandname: object) => {
  sessionStorage.setItem("role", role);
  sessionStorage.setItem("user", JSON.stringify(user));
  sessionStorage.setItem("idandname", JSON.stringify(idandname));
};
const getRole = () => {
  let role = sessionStorage.getItem("role");
  switch (role) {
    case ADMIN:
      return "管理员";
      break;
    case TEACHER:
      return "老师";
      break;
    case LABADMIN:
      return "实验室管理员";
      break;
  }
};
const getUserName = () => {
  let user = sessionStorage.getItem("user");
  let userS = shallowRef<User>();
  if (user != null) {
    userS.value = JSON.parse(user);
    return userS.value?.name;
  }
};
const getUserIdAndName = () => {
  let user = sessionStorage.getItem("idandname");
  let userS = shallowRef<User>();
  if (user != null) {
    userS.value = JSON.parse(user);
    return {
      id: userS.value?.id,
      name: userS.value?.name,
    };
  }
};
const clean = () => {
  sessionStorage.removeItem("role");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("idandname");
};
const store = {
  setUserSessionStorage,
  clean,
  getRole,
  getUserName,
  getUserIdAndName,
};
export const useUserStore = () => {
  return store;
};
