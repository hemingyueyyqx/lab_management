<script setup lang="ts">
import { ref, type Ref } from "vue";
import { cloneDeep } from "lodash-es";
import type { Course } from "@/types/index";
import { TeacherService } from "@/services/TeacherService";
import {
  ElDialog,
  ElCheckbox,
  ElCheckboxGroup,
  ElMessageBox,
  ElMessage,
} from "element-plus";
import { useCalendarStore } from "@/stores/CalendarStore";

const calendarStore = useCalendarStore();
//课程信息数组
let news = ref();
//是否处于加载状态
const loading = ref(true);
//选中的复选框
let idArr = [];
//控制详情
const detailOpen = ref(false);
//选中行的公告
const currentCourse = ref({});
//1、获取指定老师的所有课程信息
async function fetchData() {
  try {
    //loading.value = true;
    news = await TeacherService.listAllAnnouncements();
    console.log("**********");
    console.log("news", news);
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
//处理详情
function handleDetail(row: any) {
  console.log("row", row);
  currentCourse.value = cloneDeep(row);
  detailOpen.value = true;
}
// 格式化日期的方法
const formatDate = (dateStr: string) => {
  if (!dateStr) return "";
  return dateStr.replace("T", " ");
};
</script>

<template>
  <el-table
    :data="news"
    :loading="loading"
    @selection-change="selected"
    :header-cell-style="{ textAlign: 'center' }"
    :cell-style="{ textAlign: 'center' }"
    style="margin: 3px 0"
    border
  >
    <!-- <el-table-column type="selection" width=""></el-table-column> -->
    <!-- 新增的自增编号列 -->
    <el-table-column label="序号" width="">
      <template #default="scope">
        {{ scope.$index + 1 }}
      </template>
    </el-table-column>
    <!-- <el-table-column prop="id" label="编号" width="80" /> -->
    <el-table-column prop="title" label="标题" width="" />

    <el-table-column prop="author" label="作者" width="" />
    <!-- <el-table-column prop="content" label="内容" width="150" /> -->
    <el-table-column prop="updateTime" label="发布时间" width="">
      <template #default="scope">
        {{ formatDate(scope.row.updateTime) }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <!-- 传入当前行的索引（scope.$index）和整行数据（scope.row） -->
        <el-button size="small" type="primary" @click="handleDetail(scope.row)">
          <el-icon><Search /></el-icon>
          <span>详情</span>
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
  <el-dialog v-model="detailOpen" title="公告详情" width="500">
    <div class="detail-container">
      <div class="detail-title">
        <p>{{ currentCourse.title }}</p>
      </div>
      <div class="detail-author">
        <p>发布人：{{ currentCourse.author }}</p>
      </div>
      <div class="detail-content">
        <p>{{ currentCourse.content }}</p>
      </div>
      <div class="detail-time">
        <p>{{ formatDate(currentCourse.updateTime) }}</p>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button type="primary" @click="detailOpen = false">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px; /* 可根据需要调整顶部间距 */
}
.detail-container {
  display: flex;
  flex-direction: column;
}

.detail-title {
  text-align: center;
}

.detail-author {
  text-align: center;
}

.detail-content {
}

.detail-time {
  text-align: right;
}
</style>
