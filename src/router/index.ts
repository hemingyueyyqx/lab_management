import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import * as consty from "@/services/Const";
import { CommonService } from "@/services/index";
// 第二步：创建路由器
// router是路由器，routes是被它管理的路由，是数组

const router = createRouter({
  history: createWebHistory(), //路由器的工作模式
  routes: [
    {
      path: "/login",
      component: () => import("@/views/login/IndexView.vue"),
    },
    {
      path: "/",
      component: () => import("@/views/main/IndexView.vue"),
      meta: {
        roles: [consty.ADMIN, consty.TEACHER, consty.LABADMIN],
      },
      children: [
        {
          path: "/settings",
          component: () => import("@/views/main/UserSettingView.vue"),
        },
        {
          path: "/admin",
          component: () => import("@/views/main/admin/IndexView.vue"),
          meta: {
            roles: [consty.ADMIN],
          },
        },
        {
          path: "/teacher",
          component: () => import("@/views/main/teacher/IndexView.vue"),
          meta: {
            roles: [consty.TEACHER],
          },
          children: [
            {
              path: "teacherhome",
              component: () => import("@/components/home/TeacherHome.vue"),
            },
            {
              path: "course",
              component: () =>
                import("@/components/course/CourseManagement.vue"),
            },
            {
              path: "courseappointment",
              component: () =>
                import("@/components/appointment/CourseAppointment.vue"),
            },
            {
              path: "temappointment",
              component: () =>
                import("@/components/appointment/TemAppointment.vue"),
            },
            {
              path: "currentappointment",
              component: () =>
                import(
                  "@/components/currentAppointment/CurrentAppointment.vue"
                ),
            },
            {
              path: "looknews",
              component: () => import("@/components/news/LookNews.vue"),
            },
          ],
        },
        {
          path: "/labadmin",
          component: () => import("@/views/main/labadmin/IndexView.vue"),
          meta: {
            roles: [consty.LABADMIN],
          },
        },
      ],
    },
    //"/:pathMatch(.*)*" 可以匹配任何未被其他路由规则匹配到的路径。例如，像 /abc、/abc/def、/123/xyz 等任何路径，只要没有在其他路由规则中被定义，都会被这个规则捕获。
    {
      path: "/:pathMatch(.*)*",
      redirect: "/login",
    },
  ],
});

//beforeEach()全局前置守卫
router.beforeEach((to) => {
  console.log("这里是全局前置守卫！！");
  // console.log(to);
  // 断言，roles就是数组，防止其识别不出
  const roles = to.meta.roles as string[] | undefined;
  console.log(roles);
  // 排除,没有声明角色权限的路由,如登录
  if (!roles) {
    // console.log("排除没有声明权限的路由");
    return true;
  }
  // 排除，
  const role = roles.find((r) => r == CommonService.getRole());
  console.log("角色为：" + role);
  if (role) {
    console.log("排除路径");
    //如果路径是"/"就到该角色指定的页面
    if (to.path == "/") {
      if (role == consty.TEACHER) {
        return "/teacher/teacherhome";
      }
      if (role == consty.ADMIN) {
        return "/admin";
      }
      if (role == consty.LABADMIN) {
        return "/labadmin";
      }
    }
    console.log("你将要去" + to.path);
    return true;
  }
  console.log("到这里？");
  sessionStorage.clear();
  return "/login";
});
// 将写好的路由暴露出去
export default router;
// 注意，此时还要在main.ts处引用路由，这才能真正地使用路由
