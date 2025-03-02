<script setup lang="ts">
import { ref, type Ref } from "vue";
import { cloneDeep } from "lodash-es";
import type { Course, User } from "@/types/index";
import { TEACHER, LABADMIN, ADMIN } from "@/services/Const";
import {
  ElDialog,
  ElCheckbox,
  ElCheckboxGroup,
  ElMessageBox,
  ElMessage,
} from "element-plus";
import { useCalendarStore } from "@/stores/CalendarStore";
import { AdminService } from "@/services/AdminService";

const calendarStore = useCalendarStore();
//课程信息数组
let users = ref();
//是否处于加载状态
const loading = ref(true);
//选中的复选框
let idArr = [];
//控制添加课程
const addUserOpen = ref(false);
//控制编辑弹窗
const editUserOpen = ref(false);
//添加课程表单
const form = ref<User>({});
//编辑课程表单
const editForm = ref<User>({});
//1、获取所有用户信息
async function fetchData() {
  try {
    //loading.value = true;
    users = await AdminService.listUsersService();
    console.log("**********");
    console.log(users.value);
    loading.value = false;
  } catch (error) {
    console.error("Error:", error);
  }
}
//调用1
fetchData();
const selected = (data) => {
  console.log("selected", data);

  idArr = []; //重置

  data.forEach((value: any) => {
    idArr.push(value.id);
  });

  console.log("idArr:", idArr);
};

//删除所选用户
const del = () => {
  console.log("del:", idArr);
  ElMessageBox.confirm(`确定要删除所选课程吗?`, "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("删除多个用户");
      //   const code = await TeacherService.deleteCourses(idArr);
      //   if (code < 300) {
      //     location.reload(); // 刷新页面
      //   }
    })
    .catch(() => {});
};
//删除当前行的用户
const deleteCourse = (row: any) => {
  //弹提示框提示确定要删除当前课程吗
  ElMessageBox.confirm(`确定要删除名称为${row.name}这个用户吗?`, "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("删除用户");
      console.log(row);
      //   const code = await TeacherService.deleteCourse(row.id);
      //   if (code < 300) {
      //     location.reload(); // 刷新页面
      //   }
    })
    .catch(() => {});
};
//新增
const add = () => {
  //弹出对话框
  console.log("添加用户");
  addUserOpen.value = true;
};

// 添加用户提交按钮
const submit = async () => {
  //   const semester = calendarStore.getSemester();
  //   console.log(semester);
  //   form.value.semester = semester;
  console.log("form的值是");
  console.log("form:", form.value);
  try {
    await AdminService.addUserService(form.value);
    addUserOpen.value = false;
    location.reload(); // 刷新页面
  } catch (error) {
    console.error("添加课程失败:", error);
  }
};

//重置密码
const resetPassword = (index: any, row: any) => {
  ElMessageBox.confirm(`确定要重置${row.name}的密码吗?`, "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("重置密码");
      console.log(row);
      await AdminService.resetPasswordService(row.account);
      location.reload(); // 刷新页面
    })
    .catch(() => {});
};
</script>

<template>
  <div class="admin-container">
    <!-- <h3>按钮</h3> -->
    <el-button type="primary" @click="add">
      <el-icon><Plus /></el-icon>
      <span>添加用户</span>
    </el-button>
    <el-button type="danger" @click="del">
      <el-icon><Delete /></el-icon>
      <span>删除</span>
    </el-button>
    <el-table
      :data="users"
      :loading="loading"
      @selection-change="selected"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
      style="margin: 3px 0"
    >
      <el-table-column type="selection" width=""></el-table-column>
      <!-- 新增的自增编号列 -->
      <el-table-column label="序号" width="">
        <template #default="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <!-- <el-table-column prop="id" label="编号" width="80" /> -->
      <el-table-column prop="name" label="姓名" width="" />
      <el-table-column prop="account" label="账号" width="150" />
      <el-table-column prop="telephone" label="联系方式" width="" />
      <el-table-column prop="role" label="角色" width="">
        <template #default="scope">
          <!-- <span v-if="scope.row.role == ADMIN>超级管理员</span> -->
          <span v-if="scope.row.role == TEACHER">老师</span>
          <span v-if="scope.row.role == LABADMIN">实验室管理员</span>
          <span v-if="scope.row.role == ADMIN">超级管理员</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <!-- 传入当前行的索引（scope.$index）和整行数据（scope.row） -->
          <el-button
            size="small"
            type="primary"
            @click="resetPassword(scope.$index, scope.row)"
          >
            <el-icon><RefreshRight /></el-icon>
            <span>重置密码</span>
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="deleteCourse(scope.row)"
          >
            <el-icon><Delete /></el-icon>
            <span>删除</span>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
      <el-pagination
        layout="prev, pager, next, jumper, total"
        :page-size="5"
        :total="50"
      />
    </div>
    <!-- 添加课程模态框 -->
    <el-dialog v-model="addUserOpen" title="添加用户" width="500">
      <el-form :model="form">
        <el-form-item label="姓名">
          <el-input
            v-model="form.name"
            autocomplete="off"
            placeholder="请输入用户姓名"
          />
        </el-form-item>
        <el-form-item label="账号">
          <el-input
            v-model="form.account"
            autocomplete="off"
            placeholder="请输入账号"
          />
        </el-form-item>
        <el-form-item label="电话">
          <el-input
            v-model="form.telephone"
            autocomplete="off"
            placeholder="请输入联系方式"
          />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="form.role" placeholder="请选择用户角色">
            <el-option label="老师" value="Js09" />
            <el-option label="实验室管理员" value="lM07" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="addUserOpen = false">取消</el-button>
          <el-button type="primary" @click="submit"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px; /* 可根据需要调整顶部间距 */
}
.admin-container {
  padding: 10px;
}
</style>
