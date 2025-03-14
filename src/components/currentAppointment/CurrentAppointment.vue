<script setup lang="ts">
import { ref, type Ref } from "vue";
import { cloneDeep } from "lodash-es";
import type { Course, Appointment } from "@/types/index";
import { TeacherService } from "@/services/TeacherService";
import {
  ElDialog,
  ElCheckbox,
  ElCheckboxGroup,
  ElMessageBox,
  ElMessage,
} from "element-plus";
import { useCalendarStore } from "@/stores/CalendarStore";
//引入路由实例
import { useRouter } from "vue-router";
const router = useRouter();

const calendarStore = useCalendarStore();
//预约信息数组
let appointments = ref([]);
//是否处于加载状态
const loading = ref(true);
//选中的复选框
let idArr = [];
// 控制删除模态框显示
const deleteDialogVisible = ref(false);
// 当前要删除的课程信息
const currentCourse = ref<{
  id: string;
  labId: string;
  name: string;
  weeks: number[];
}>({
  id: "",
  labId: "",
  name: "",
  weeks: [],
});
// 选中的周次
const selectedWeeks = ref<number[]>([]);
//1、获取指定老师的所有课程信息
async function fetchData() {
  try {
    loading.value = true;
    const resp = await TeacherService.listCoursesByTid();
    console.log("**********", resp);
    console.log(resp.value);
    // for (let i = 0; i < resp.value.length; i++) {
    //   appointments.value.push(resp.value[i].appointment);
    // }
    if (resp.value) {
      // 合并课程信息
      const mergedData = mergeCourses(resp.value);
      appointments.value = mergedData;
    }
    console.log("appointments", appointments.value);
    // appointments.value = resp.value;
    // console.log("appointments", appointments.value);
    loading.value = false;
  } catch (error) {
    console.error("Error:", error);
  }
}
//调用1
fetchData();
// 合并课程信息的函数
const mergeCourses = (data) => {
  const mergedMap = new Map();
  data.forEach((item) => {
    const key = `${item.course.name}-${item.appointment.labName}-${item.appointment.dayofweek}-${item.appointment.section}`;
    if (mergedMap.has(key)) {
      const existingItem = mergedMap.get(key);
      // 这里也需要确保拼接时是字符串类型
      existingItem.appointment.week += `, ${String(item.appointment.week)}`;
    } else {
      mergedMap.set(key, { ...item });
    }
  });

  const mergedData = Array.from(mergedMap.values());
  mergedData.forEach((item) => {
    // 先将其转换为字符串
    const weekStr = String(item.appointment.week);
    // 检查是否有逗号，如果没有逗号说明只有一个周次，不需要处理
    if (!weekStr.includes(",")) {
      return;
    }
    const weeks = weekStr
      .split(",")
      .map((week) => parseInt(week.trim()))
      .filter((week) => !isNaN(week))
      .sort((a, b) => a - b);

    const ranges = [];
    let start = weeks[0];
    let end = weeks[0];

    for (let i = 1; i < weeks.length; i++) {
      if (weeks[i] === end + 1) {
        end = weeks[i];
      } else {
        if (start === end) {
          ranges.push(start.toString());
        } else {
          ranges.push(`${start}-${end}`);
        }
        start = end = weeks[i];
      }
    }

    if (start === end) {
      ranges.push(start.toString());
    } else {
      ranges.push(`${start}-${end}`);
    }
    item.appointment.week = ranges.join(", ");
  });

  return mergedData;
};
const selected = (data) => {
  console.log("selected", data);

  idArr = []; //重置

  data.forEach((value: any) => {
    idArr.push(value.course.id);
  });

  console.log("idArr:", idArr);
};

//删除所选课程
const del = () => {
  console.log("del:", idArr);
  ElMessageBox.confirm(`确定要删除所选课程的全部预约记录吗?`, "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("删除多门课程全部预约记录");
      const code = await TeacherService.deleteAppointment(idArr);
      if (code < 300) {
        // location.reload(); // 刷新页面
        fetchData();
      }
    })
    .catch(() => {});
};
// 打开删除模态框
const openDeleteDialog = (row: any) => {
  console.log("row:", row);
  const weeks = row.appointment.week.split(", ").flatMap((range) => {
    if (range.includes("-")) {
      const [start, end] = range.split("-").map(Number);
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }
    return [Number(range)];
  });
  currentCourse.value = {
    id: row.course.id,
    labId: row.appointment.labId,
    name: row.course.name,
    weeks,
  };
  console.log("currentCourse:", currentCourse.value);

  selectedWeeks.value = [];
  deleteDialogVisible.value = true;
};

// 确认删除操作
const confirmDelete = async () => {
  console.log("要删除的课程 ID:", currentCourse.value.id);
  console.log("选中的周次:", selectedWeeks.value);
  try {
    // 弹出确认对话框
    await ElMessageBox.confirm(
      `确定要删除课程${currentCourse.value.name}的所选预约周次吗?`,
      "Warning",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    // 用户点击了确认，执行删除操作
    const code = await TeacherService.deleteAppointmentByCourseId({
      courseId: currentCourse.value.id,
      labId: currentCourse.value.labId,
      weeks: selectedWeeks.value,
    });

    if (code < 300) {
      // 删除成功
      // ElMessage.success("删除成功");
      deleteDialogVisible.value = false;
      // location.reload();
      fetchData();
    } else {
      // 删除失败
      throw new Error(`删除失败，状态码: ${code}`);
    }
  } catch (error) {
    if (error === "cancel") {
      // 用户点击了取消
      console.log("用户取消了删除操作");
    } else {
      // 真正的删除失败
      console.error("删除失败:", error);
      ElMessage.error("删除失败");
    }
  }
};

//新增
const add = (type: Number) => {
  //弹出对话框
  console.log("预约课程");
  if (type == 1) {
    router.push("/teacher/courseappointment");
  } else {
    router.push("/teacher/temappointment");
  }
};
</script>

<template>
  <!-- <h3>按钮</h3> -->
  <!-- <el-button type="primary" @click="add">
    <el-icon><Plus /></el-icon>
    <span>预约</span>
  </el-button> -->
  <el-dropdown style="margin-right: 10px">
    <el-button type="primary" @click="">
      <el-icon><Plus /></el-icon>
      <span>预约</span>
    </el-button>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="add(1)">课程预约</el-dropdown-item>
        <el-dropdown-item @click="add(2)">临时预约</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <el-button type="danger" @click="del">
    <el-icon><Delete /></el-icon>
    <span>删除</span>
  </el-button>
  <el-table
    :data="appointments"
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
    <el-table-column prop="course.name" label="课程名称" width="" />
    <el-table-column prop="appointment.dayofweek" label="星期" width="" />
    <el-table-column prop="appointment.section" label="节次" width="" />
    <el-table-column prop="appointment.week" label="周次" width="" />
    <el-table-column prop="appointment.labName" label="实验室" width="" />
    <!-- <el-table-column
      prop="course.experimentHour"
      label="实验学时"
      width="150"
    /> -->
    <!-- <el-table-column prop="quantity" label="上课人数" width="" />
    <el-table-column prop="clazz" label="课程班级" width="" /> -->
    <el-table-column prop="appointment.nature" label="预约类型" width="">
      <!-- <template #default="scope">
        <span v-if="scope.row.type == 0">必修课</span>
        <span v-else>选修课</span>
      </template> -->
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <!-- 传入当前行的索引（scope.$index）和整行数据（scope.row） -->
        <!-- <el-button
          size="small"
          type="primary"
          @click="edit(scope.$index, scope.row)"
        >
          <el-icon><Edit /></el-icon>
          <span>修改</span>
        </el-button> -->
        <el-button
          type="danger"
          size="small"
          @click="openDeleteDialog(scope.row)"
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
    <!-- 删除模态框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="删除预约"
      width="500"
      @close="deleteDialogVisible = false"
    >
      <!---<template #content>-->
      <p>课程名称: {{ currentCourse.name }}</p>
      <p>请选择你要删除的周次：</p>
      <el-checkbox-group v-model="selectedWeeks">
        <el-checkbox
          v-for="week in currentCourse.weeks"
          :key="week"
          :value="week"
        >
          第 {{ week }} 周
        </el-checkbox>
      </el-checkbox-group>
      <!-- </template> -->
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDelete">确定</el-button>
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
</style>
