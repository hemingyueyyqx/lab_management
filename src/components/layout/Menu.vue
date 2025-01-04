<script setup lang="ts">
import { type Component, ref } from "vue";
import { ElSubMenu, ElMenuItem } from "element-plus";
import { House } from "@element-plus/icons-vue";
import router from "@/router";
const defaultActive = ref<string>(router.currentRoute.value.path);
interface MenuItem {
  id: number;
  name: string;
  index: string;
  icon?: Component;
  children?: MenuItem[];
}
const menulist: MenuItem[] = [
  {
    id: 1,
    name: "首页",
    index: "/teacher/teacherhome",
    icon: House,
  },
  {
    id: 2,
    name: "课程管理",
    index: "/teacher/course",
    icon: House,
  },
  {
    id: 3,
    name: "预约管理",
    index: "/teacher/appointment",
    icon: House,
    children: [
      {
        id: 4,
        name: "课程预约",
        index: "/teacher/courseappointment",
      },
      {
        id: 5,
        name: "临时预约",
        index: "/teacher/temappointment",
      },
    ],
  },
  {
    id: 6,
    name: "当前预约",
    index: "/teacher/currentappointment",
    icon: House,
  },
  {
    id: 7,
    name: "查看公告",
    index: "/teacher/looknews",
    icon: House,
  },
];
</script>
<template>
  <div id="menu">
    <!-- 使用router会在激活导航的时候以index作为path进行路由跳转 -->
    <el-menu
      active-text-color="#fff"
      background-color="#2b2c44"
      class="el-menu-vertical-demo"
      :default-active="defaultActive"
      text-color="#fff"
      router
    >
      <component
        :is="item.children ? ElSubMenu : ElMenuItem"
        v-for="item in menulist"
        :key="item.id"
        :index="item.index"
      >
        <template v-if="item.children" #title>
          <!-- <el-icon v-if="item.icon">
              <component :is="item.icon">
              </component>
            </el-icon> -->
          <span>{{ item.name }}</span>
        </template>
        <span v-if="!item.children">
          <!-- <el-icon v-if="item.icon">
              <component :is="item.icon">
              </component>
            </el-icon> -->
          <span>{{ item.name }}</span>
        </span>
        <el-menu-item
          v-for="subItem in item.children"
          :key="subItem.id"
          :index="subItem.index"
        >
          {{ subItem.name }}
        </el-menu-item>
      </component>
    </el-menu>
  </div>
</template>
<style scoped>
/* #menu {
  height: 100vh;
  width: 200px;
} */
</style>
