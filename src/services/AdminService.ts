import axios, { useDelete, useGet, usePost, usePatch, usePut } from "@/axios";
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
        ElMessage.success("用户添加成功！");
      }
    } catch (error) {
      console.error("添加用户失败:", error);
      throw error;
    }
  };

  static getGraph2 = async () => {
    const res = await useGet("admin/graph2");
    return res;
  };
  static getGraph3 = async () => {
    const res = await useGet("admin/graph3");
    return res;
  };
  static getGraph1 = async () => {
    const res = await useGet("admin/graph1");
    return res;
  };

  static deleteNews = async (id: string) => {
    await useDelete(`labadmin/news/${id}`);
    return id; // 返回删除的id，以便在调用处确认
  };

  static deleteNewsBatch = async (ids: string[]) => {
    //   for (const id of ids) {
    //   await useDelete(`admin/news/${id}`);
    // }
    const deletePromises = ids.map((id) => useDelete(`labadmin/news/${id}`));
    await Promise.all(deletePromises);
  };
  static updateNews = async (obj: object) => {
    console.log("22");
    const res = await usePatch("labadmin/news", obj);
    console.log("111" + res);
  };
  static addNews = async (obj: unknown) => {
    console.log("-------");
    await usePost("labadmin/news", obj);
  };
  static getNews = async () => {
    const res = await useGet("users/news");
    return res;
  };
}
