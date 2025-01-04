<script setup lang="ts">
import AdminHeader from "@/components/layout/Header.vue";
import AdminMenu from "@/components/layout/Menu.vue";
import { TeacherService } from "@/services/TeacherService";
import { createElLoading } from "@/components/loading/index";
import { onMounted, ref } from "vue";
</script>
<template>
  <div id="home">
    <el-container>
      <el-header>
        <AdminHeader></AdminHeader>
      </el-header>
      <el-container>
        <!-- <el-affix> -->
        <el-aside width="200px">
          <AdminMenu></AdminMenu>
        </el-aside>
        <!-- </el-affix> -->
        <el-main>
          <div class="fitsize"><RouterView></RouterView></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
#home {
  min-height: 100vh;
  padding: 0;
  margin: 0;
}
#menu {
  min-height: calc(100vh + 60px);
}

#header {
  background-color: #2b2c44;
  color: #fff;
  display: flex;
  justify-content: space-between;
}
.el-header {
  position: fixed;
  background-color: #2b2c44;
  width: 100vw;
  z-index: 99;
  padding: 0;
}
.el-aside {
  background-color: #2b2c44;
  width: 200px;
  margin-top: 60px;
  min-height: calc(100vh);
}
.el-main {
  margin-top: 75px;
  left: 200px;
}
/* .fitsize {
  zoom: 75%;
} */
</style>
