// 引入createApp用于创建应用
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
//导入路由守卫
// import "@/router/permission";
// 引入App根组件
import App from "./App.vue";
//引入路由器
import router from "./router";

// 创建一个应用
const app = createApp(App);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
//使用路由器
app.use(router);
//使用elementplus
app.use(ElementPlus);
// 使用store
// app.use(store);

//挂载整个应用到app容器中
app.mount("#app");
