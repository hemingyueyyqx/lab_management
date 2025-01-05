import { useDelete, useGet, usePost, usePatch, usePut } from "@/axios";
import { type Ref } from "vue";
import { useCoursesStore } from "@/stores/TeacherStore";
import { type Course } from "@/types/index";
import { StoreCache, ELLoading } from "./Decorators";
import { type User } from "../types";

const coursesStore = useCoursesStore();
export class AdminService {
  // 获取该老师所有的课程
  @StoreCache(coursesStore.coursesS)
  @ELLoading()
  static async listCoursesService() {
    console.log("你将要请求老师所有的课程数据");
    const data = await useGet(`users/courses`);
    return data as unknown as Ref<Course[]>;
  }
  static listUsersService = async () => {
    const data = await useGet("admin/users");
    return data as unknown as Ref<User[]>;
  };

  //这有问题
  //   static changePasswordService = async (user: User) => {
  //     console.log(user.account);
  //     const account = user.account
  //     await usePut("admin/users/${account}/password");
  //   };
  static changePasswordService = async (user: User) => {
    console.log(user.account);
    await usePatch("admin/user2", user);
  };
  //这有问题 原来是account唯一性冲突
  static addUserService = async (user: User) => {
    console.log("222---------");
    try {
      const res = await usePost("admin/user", user);
      console.log("111----------");
      console.log(res);
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
