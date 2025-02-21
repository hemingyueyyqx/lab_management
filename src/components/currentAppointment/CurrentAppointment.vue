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

const calendarStore = useCalendarStore();
//预约信息数组
let appointments = ref([]);
//是否处于加载状态
const loading = ref(true);
//选中的复选框
let idArr = [];
//控制添加课程
// const addCourseOpen = ref(false);
//控制编辑弹窗
// const editCourseOpen = ref(false);
//添加课程表单
// const form = ref<Course>({});
//编辑课程表单
// const editForm = ref<Course>({});
//1、获取指定老师的所有课程信息
async function fetchData() {
  try {
    //loading.value = true;
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
const mergeCourses = (data: any[]) => {
  const mergedMap = new Map();
  data.forEach((item) => {
    //这行代码使用模板字符串生成一个唯一的键
    const key = `${item.course.name}-${item.appointment.labName}-${item.appointment.dayofweek}-${item.appointment.section}`;
    //mergedMap.has(key) 用于检查 mergedMap 中是否已经存在当前生成的键。如果存在，说明之前已经处理过相同课程名称、星期和节次的课程信息。
    if (mergedMap.has(key)) {
      //mergedMap.get(key) 用于获取该键对应的值，也就是之前存储的合并后的课程对象，将其赋值给 existingItem。
      const existingItem = mergedMap.get(key);
      //   console.log("existingItem:", existingItem);

      // 合并周次信息，这里简单地将周次拼接起来，你可以根据实际需求修改
      existingItem.appointment.week += `, ${item.appointment.week}`;
    } else {
      //使用扩展运算符 ... 来创建 item 的副本，避免后续修改影响原始数据。
      mergedMap.set(key, { ...item });
    }
  });
  //mergedMap.values() 返回 mergedMap 中所有的值的迭代器。
  //Array.from() 方法将这个迭代器转换为一个数组，最终返回合并后的课程信息数组。
  //   return Array.from(mergedMap.values());
  // 处理合并后的周次信息
  const mergedData = Array.from(mergedMap.values());
  mergedData.forEach((item) => {
      const weeks = item.appointment.week
    //将周次字符串按逗号分割成一个字符串数组
          .split(",")
      //对分割后的每个字符串元素去除首尾空格（trim()），然后转换为整数（parseInt()），最终得到一个整数数组，例如 [1, 2, 3, 6, 7]。
          .map((week) => parseInt(week.trim()))
      //filter((week) => !isNaN(week))：过滤掉数组中不是有效数字的元素（isNaN() 用于判断一个值是否为 NaN），确保数组中只包含有效的周次数字
          .filter((week) => !isNaN(week))
      //sort((a, b) => a - b)：对数组进行升序排序，保证周次是按从小到大的顺序排列
      .sort((a, b) => a - b);

    const ranges: string[] = [];
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
    //使用 join(", ") 方法将 ranges 数组中的元素用逗号和空格连接成一个字符串，例如 ["1-3", "6-7"] 会变成 "1-3, 6-7"。
    item.appointment.week = ranges.join(", ");
  });

  return mergedData;
};
const selected = (data) => {
  console.log("selected", data);

  idArr = []; //重置

  data.forEach((value: any) => {
    idArr.push(value.id);
  });

  console.log("idArr:", idArr);
};

//删除所选课程
const del = () => {
  console.log("del:", idArr);
  ElMessageBox.confirm(`确定要删除所选课程吗?`, "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("删除多门课程");
      const code = await TeacherService.deleteCourses(idArr);
      if (code < 300) {
        location.reload(); // 刷新页面
      }
    })
    .catch(() => {});
};
//删除当前行的课程
const deleteCourse = (row: any) => {
  //弹提示框提示确定要删除当前课程吗
  ElMessageBox.confirm(`确定要删除名称为${row.name}这门课程吗?`, "Warning", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(async () => {
      console.log("删除课程");
      console.log(row);
      const code = await TeacherService.deleteCourse(row.id);
      if (code < 300) {
        location.reload(); // 刷新页面
      }
    })
    .catch(() => {});
};
//新增
const add = () => {
  //弹出对话框
  console.log("预约课程");
  //   addCourseOpen.value = true;
};
//编辑
// const edit = (index: any, row: any) => {
//   console.log("index:", index, "row:", row);
//   //执行 editForm.value = row 时，editForm.value 和 row 指向了同一个对象。所以，当你在编辑弹窗中修改 editForm 的属性时，courses 数组中对应的对象属性也会被修改。
//   //解决方法
//   editForm.value = cloneDeep(row);
//   // 确保 editForm.type 是字符串类型
//   if (typeof editForm.value.type === "number") {
//     editForm.value.type = String(editForm.value.type);
//   }
//   //弹出对话框
//   editCourseOpen.value = true;
// };
// 添加课程提交按钮
// const submit = async () => {
//   const semester = calendarStore.getSemester();
//   console.log(semester);
//   form.value.semester = semester;
//   console.log("form的值是");
//   console.log("form:", form.value);
//   try {
//     await TeacherService.addCourse(form.value);
//     addCourseOpen.value = false;
//     location.reload(); // 刷新页面
//   } catch (error) {
//     console.error("添加课程失败:", error);
//   }
// };
//编辑提交按钮
// const editSubmit = async () => {
//   console.log("editForm的值是");
//   console.log("editForm:", editForm.value);
//   await TeacherService.updateCourse(editForm.value);
//   editCourseOpen.value = false;
//   editForm.value = {};
//   location.reload(); // 刷新页面
// };
//编辑取消按钮
// const editCancel = () => {
//   editCourseOpen.value = false;
//   editForm.value = {};
// };
</script>

<template>
  <!-- <h3>按钮</h3> -->
  <el-button type="primary" @click="add">
    <el-icon><Plus /></el-icon>
    <span>预约</span>
  </el-button>
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
        <el-button type="danger" size="small" @click="deleteCourse(scope.row)">
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
  <!-- <el-dialog v-model="addCourseOpen" title="添加课程" width="500">
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
  </el-dialog> -->
  <!-- 编辑弹窗 -->
  <!-- <el-dialog v-model="editCourseOpen" title="修改课程" width="500">
    <el-form :model="editForm">
      <el-form-item label="课程名称">
        <el-input
          v-model="editForm.name"
          autocomplete="off"
          placeholder="请输入课程名称"
        />
      </el-form-item>
      <el-form-item label="实验学时">
        <el-input
          v-model="editForm.experimentHour"
          autocomplete="off"
          placeholder="请输入实验学时"
        />
      </el-form-item>
      <el-form-item label="上课人数">
        <el-input
          v-model="editForm.quantity"
          autocomplete="off"
          placeholder="请输入上课人数"
        />
      </el-form-item>
      <el-form-item label="课程班级">
        <el-input
          v-model="editForm.clazz"
          autocomplete="off"
          placeholder="请输入课程班级"
        />
      </el-form-item>
      <el-form-item label="课程类型">
        <el-select v-model="editForm.type" placeholder="请选择课程类型">
          <el-option label="必修课" value="0" />
          <el-option label="选修课" value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="editCancel">取消</el-button>
        <el-button type="primary" @click="editSubmit"> 确定 </el-button>
      </div>
    </template>
  </el-dialog> -->
</template>

<style scoped>
.pagination-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px; /* 可根据需要调整顶部间距 */
}
</style>
