import axios, {
  useDelete,
  useGet,
  usePost,
  usePatch,
  usePut,
} from "@/axios";
import { type Ref } from "vue";
import { useCoursesStore } from "@/stores/TeacherStore";
import { type Course } from "@/types/index";
import { StoreCache, ELLoading } from "./Decorators";
import { type User } from "../types";
import {
  ElDialog,
  ElCheckbox,
  ElCheckboxGroup,
  ElMessageBox,
  ElMessage,
} from "element-plus";

const coursesStore = useCoursesStore();
export class AdminService {
  //获取所有用户
  static listUsersService = async () => {
    const data = await useGet("admin/users");
    return data as unknown as Ref<User[]>;
  };
  //重置密码
  static resetPasswordService = async (account: any) => {
    // await usePut(`admin/${account}/password`, null);
    try {
      const resp = await axios.put(`admin/users/${account}/password`, null);
      if (resp.data.code < 300) {
        console.log("重置密码成功！");
        ElMessage.success("重置密码成功！");
      }
    } catch (error) {
      console.error("重置密码失败:", error);
      throw error;
    }
  };
  //添加用户
  static addUserService = async (user: User) => {
    // console.log("222---------");
    try {
      const resp = await axios.post("admin/users", user);
      // console.log("111----------");
      if (resp.data.code < 300) {
        console.log("用户添加成功！");
        // ElMessage.success("用户添加成功！");
      }
      return resp.data.code;
    } catch (error) {
      console.error("添加用户失败:", error);
      throw error;
    }
  };

  static deleteUserService = async (ids: any) => {
    try {
      const resp = await axios.delete(`admin/users/${ids}`);
      // console.log("111----------");
      if (resp.data.code < 300) {
        console.log("用户删除成功！");
        ElMessage.success("用户删除成功！");
      }
      return resp.data.code;
    } catch (error) {
      console.error("删除用户失败:", error);
      throw error;
    }
  };
}
