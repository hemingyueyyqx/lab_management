// 基于axios的http请求封装
import axios, { useGet, usePatch, usePost } from "@/axios";
import router from "@/router";
import { ADMIN, TEACHER, LABADMIN } from "@/services/Const";
import { useUserStore } from "@/stores/UserStore";
// import { useProcessStore } from "@/stores/ProcessStore";
import type { ResultVO, User } from "@/types";

import { ElMessage } from "element-plus";
// import { StoreCache } from "./Decorators";

// const processStore = useProcessStore();

export class CommonService {
  // login
  static loginService = async (user: User) => {
    console.log("到这里了嘛？这里是负责login的service哦");
    // 发起post请求，这边请求到了响应拦截器那里
    const resp = await axios.post<ResultVO<User>>("login", user);
    console.log("emmmm思考");
    const us = resp.data.data;
    const token = resp.headers.token;
    const role = resp.headers.role;
    const { id, name } = us;
    console.log(",,,," + role);
    const message = resp.data.message;
    //console.log("mmmmmmm" + message);
    if (!us || !token || !role) {
      //ElMessage.error('登录失败！' + message)
      throw "登录错误";
    }
    sessionStorage.setItem("token", token);
    const userStore = useUserStore();
    // 将角色和身份也一起传进SessionStorage
    userStore.setUserSessionStorage(us, role, { id, name });
    ElMessage.success("登录成功！");
    // 账号密码一样就重置密码;
    if (user.account === user.password) {
      console.log("欸？");
      router.push("/settings");
      return;
    }
    let path = "";
    switch (role) {
      case ADMIN:
        path = "/admin";
        break;
      case TEACHER:
        console.log("老师嘛？");
        path = "/teacher/teacherhome";
        break;
      case LABADMIN:
        console.log("实验室管理员嘛？");
        path = "/teacher";
        break;
    }
    router.push(path);
  };

  //logout
  static logoutService = async () => {
    let userStore = useUserStore();
    userStore.clean();
    ElMessage.success("退出登录成功！");
    router.push("/login");
  };

  static updateSelfPassword = async (pwd: string) => {
    await usePatch("user/password", { password: pwd });
  };

  static getRole() {
    return sessionStorage.getItem("role");
  }
}
