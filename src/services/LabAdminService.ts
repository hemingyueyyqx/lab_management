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
export class LabAdminService {
  static deleteUserService = async (ids: any) => {
    try {
      const resp = await axios.delete(`labadmin/annos/${ids}`);
      // console.log("111----------");
      if (resp.data.code < 300) {
        console.log("公告删除成功！");
        ElMessage.success("用户删除成功！");
      }
      return resp.data.code;
    } catch (error) {
      console.error("删除公告失败:", error);
      throw error;
    }
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
  static listAnnos = async (author: any) => {
    const data = await useGet("labadmin/news/${author}");
    return data as unknown as Ref<User[]>;
  };
  static listLabs = async (id: any) => {
    const data = await useGet(`labadmin/news/${id}`);
    return data as unknown as Ref<User[]>;
  };
}
