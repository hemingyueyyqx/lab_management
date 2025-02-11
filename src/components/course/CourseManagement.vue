<script setup lang="ts">
import { ref, type Ref } from "vue";
import type { Course } from "@/types/index";
import { TeacherService } from "@/services/TeacherService";
import { ElDialog, ElCheckbox, ElCheckboxGroup } from "element-plus";

//课程信息数组
let courses = ref();
//是否处于加载状态
const loading = ref(true);
//选中的复选框
let idArr = [];
//控制添加课程
const addCourseOpen = ref(false);
//添加课程表单
const form = ref<Course>({});
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
//2、添加课程
async function addCourse(course: Course) {
  try {
    await TeacherService.addCourse(course);
    location.reload(); // 刷新页面
  } catch (error) {
    console.error("Error:", error);
  }
}
const selected = (data) => {
  console.log("selected", data);

  idArr = []; //重置

  data.forEach((value: any) => {
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
  addCourseOpen.value = true;
};
//编辑
const edit = (index: any, row: any) => {
  console.log("index:", index, "row:", row);
};
//添加课程提交按钮
const submit = () => {
  console.log("form:", form.value);
  addCourse(form.value);
  addCourseOpen.value = false;
  fetchData();
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
    <el-table-column prop="clazz" label="课程班级" />
    <el-table-column prop="type" label="课程类型" />
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
  <!-- 添加课程模态框 -->
  <el-dialog v-model="addCourseOpen" title="添加课程" width="500">
    <el-form :model="form">
      <el-form-item label="课程名称">
        <el-input
          v-model="form.name"
          autocomplete="off"
          placeholder="请输入课程名称"
        />
      </el-form-item>
      <el-form-item label="实验学时">
        <el-input
          v-model="form.experimentHour"
          autocomplete="off"
          placeholder="请输入实验学时"
        />
      </el-form-item>
      <el-form-item label="上课人数">
        <el-input
          v-model="form.quantity"
          autocomplete="off"
          placeholder="请输入上课人数"
        />
      </el-form-item>
      <el-form-item label="课程班级">
        <el-input
          v-model="form.clazz"
          autocomplete="off"
          placeholder="请输入课程班级"
        />
      </el-form-item>
      <el-form-item label="课程类型">
        <el-select v-model="form.type" placeholder="请选择课程类型">
          <el-option label="必修课" value="0" />
          <el-option label="选修课" value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="addCourseOpen = false">取消</el-button>
        <el-button type="primary" @click="submit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
