<script setup lang="ts">
import { ref,type Ref } from "vue";
import type { Course } from "@/types/index";
import { TeacherService } from "@/services/TeacherService";
import { ElDialog, ElCheckbox, ElCheckboxGroup } from "element-plus";
const data = ref({
  arr: [
    { id: "1", name: "java", experimentHour: "8", quantity: "45" },
    { id: "2", name: "web", experimentHour: "8", quantity: "50" },
    { id: "3", name: "数据库系统原理", experimentHour: "8", quantity: "67" },
    { id: "4", name: "大学物理", experimentHour: "8", quantity: "89" },
  ],
});
//课程信息数组
let courses = ref();
//是否处于加载状态
const loading = ref(true);
//选中的复选框
let idArr = [];
//1、获取指定老师的所有课程信息
async function fetchData() {
  try {
    courses = await TeacherService.listCoursesService();
    console.log("**********");
      console.log(courses.value);
    loading.value = false;
  } catch (error) {
    console.error("Error:", error);
  }
}
//调用1
fetchData();
//1、添加课程
async function addCourse(course:Course) {
  try {
    await TeacherService.addCourse(course);
    location.reload(); // 刷新页面
  } catch (error) {
    console.error("Error:", error);
  }
}
const selected = (data) => {
  console.log("selected", data)

  idArr = []; //重置

  data.forEach((value) => {
    idArr.push(value.id);
  });

  console.log("idArr:", idArr);
};

//删除
const del = () => {
  console.log("del:", idArr);
};
//新增
const add = () => {
    //弹出对话框
 console.log("添加课程");
 
};

//编辑
const edit = (index, row) => {
  console.log("index:", index, "row:", row);
};
</script>

<template>
  <!-- <h3>按钮</h3> -->
  <el-button type="primary" @click="add">新增</el-button>
  <el-button type="primary" @click="del">批量删除</el-button>

  <el-table
    :data="courses"
    :loading="loading"
    @selection-change="selected"
    border
    style="width: 900px; margin: 3px 0"
  >
    <el-table-column type="selection" width="55"></el-table-column>
    <!-- 新增的自增编号列 -->
    <el-table-column label="序号" width="80">
      <template #default="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column>
    <!-- <el-table-column prop="id" label="编号" width="80" /> -->
    <el-table-column prop="name" label="课程名称" />
    <el-table-column prop="experimentHour" label="实验学时" />
    <el-table-column prop="quantity" label="上课人数" />

    <el-table-column label="操作" width="150">
      <template #default="scope">
        <!-- 传入当前行的索引（scope.$index）和整行数据（scope.row） -->
        <el-button
          size="small"
          type="primary"
          @click="edit(scope.$index, scope.row)"
        >
          编辑
        </el-button>
        <el-button size="small">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <el-pagination
    layout="prev, pager, next, jumper, total"
    :page-size="5"
    :total="50"
  />
</template>

<style scoped></style>
