<script setup lang="ts">
import { ref, onMounted } from "vue";
import { TeacherService } from "@/services/TeacherService";
import { useCalendarStore } from "@/stores/CalendarStore";
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElButton,
} from "element-plus";
import { useUserStore } from "@/stores/UserStore";

// 数据与状态
const store = useUserStore();
const calendarStore = useCalendarStore();
const weekOfDays = [0, 1, 2, 3, 4, 5, 6]; // 一周天数
const labs = Array.from({ length: 22 }, (_, i) => 901 + i); // 实验室编号 901~922

const labCourses = ref<Record<string, any[]>>({}); // 实验室分组课程数据
const labSelected = ref<string>("901"); // 当前选中的实验室
const modalData = ref<any[]>([]); // 模态框显示的课程数据

const selectedFreeWeeks = ref<number[]>([]); // 用户选择的空闲周
const selectedAppointmentType = ref<string>("课程预约"); // 预约类型

const appointmentTypes = ["课程预约", "答辩", "答疑", "其他"]; // 预约类型选项

// 用于记录每个空闲周次按钮的点击状态（颜色深浅变化），初始为 false 表示未被点击变深
const buttonClickedStatus = ref<Record<number, boolean>>({});

// 将数字转换为中文
const numberToChinese = (n: number, identifier?: string) => {
  const chnArr = [
    "零",
    "一",
    "二",
    "三",
    "四",
    "五",
    "六",
    "七",
    "八",
    "九",
    "十",
    "十一",
    "十二",
    "十三",
    "十四",
    "十五",
    "十六",
    "十七",
    "十八",
    "十九",
  ];
  return identifier === "week" && (n === 0 || n === 7) ? "日" : chnArr[n];
};

// 获取课程数据并整理
const fetchData = async () => {
  try {
    const response = await TeacherService.listAllCourses();
    const courses = response.value;

    const labMap: Record<string, any[]> = {};
    labs.forEach((lab) => {
      labMap[lab.toString()] = [];
    });

    courses.forEach(({ appointment, course }) => {
      const { labName, week, dayofweek, section, teacher } = appointment;
      const { clazz, name } = course;
      const teacherName = JSON.parse(teacher)?.name || "未知";

      if (labMap[labName]) {
        labMap[labName].push({
          week,
          dayofweek,
          section,
          clazz,
          name,
          teacherName,
        });
      }
    });

    labCourses.value = labMap;
    selectLab("901");
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

const selectLab = (labName: string) => {
  labSelected.value = labName;
};

const getCellData = (weekSection: number, weekOfDay: number) => {
  return (
    labCourses.value[labSelected.value]?.filter(
      (course: any) =>
        course.dayofweek === weekOfDay && course.section === weekSection
    ) || []
  );
};

// 控制对话框显示隐藏的响应式变量
const dialogVisible = ref(false);
// 存储当前点击课程小格对应的课程数据
const currentCellData = ref<any[]>([]);
let freeWeeks = ref<number[]>([]);
const showDialog = (weekSection: number, weekOfDay: number) => {
  const cellData = getCellData(weekSection, weekOfDay);
  const occupiedWeeks = cellData.map((course: any) => course.week);
  const allWeeks = Array.from({ length: 19 }, (_, i) => i + 1);
  // 修正此处逻辑，获取空闲周次时排除已选周次
  freeWeeks.value = allWeeks.filter(
    (week) =>
      !occupiedWeeks.includes(week) && !selectedFreeWeeks.value.includes(week)
  );
  console.log(freeWeeks);
  selectedFreeWeeks.value = [];
  selectedAppointmentType.value = "课程预约";
  currentCellData.value = cellData;
  console.log("信息为");
  console.log(currentCellData.value);
  dialogVisible.value = true;
  // 初始化当前对话框中所有空闲周次按钮的点击状态为 false
  //   freeWeeks.forEach((week) => {
  //     buttonClickedStatus.value[week] = false;
  //   }
  // );
};

const toggleWeekSelection = (week: number) => {
  const index = selectedFreeWeeks.value.indexOf(week);
  if (index === -1) {
    selectedFreeWeeks.value.push(week);
  } else {
    selectedFreeWeeks.value.splice(index, 1);
  }
  // 切换对应按钮的点击状态
  buttonClickedStatus.value[week] = !buttonClickedStatus.value[week];
};

onMounted(() => {
  fetchData();
});
</script>
<template>
  <div class="timetable">
    <div class="timetable-controller">
      <el-button
        v-for="lab in labs"
        :key="lab"
        class="el-button"
        size="large"
        style="margin: 10px 5px"
        :type="lab.toString() === labSelected ? 'primary' : 'default'"
        @click="selectLab(lab.toString())"
      >
        实验室 {{ lab }}
      </el-button>
    </div>

    <div class="timetable-contain">
      <table>
        <thead>
          <tr>
            <th></th>
            <th v-for="(day, index) in weekOfDays" :key="index">
              {{ "周" + numberToChinese(day + 1, "week") }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(section, index1) in [1, 3, 5, 7, 9, 11]" :key="index1">
            <td>
              {{
                "第" +
                numberToChinese(section) +
                numberToChinese(section + 1) +
                "节"
              }}
            </td>
            <td
              v-for="day in weekOfDays"
              :key="day"
              class="course-box-background"
              @click="showDialog(section, day + 1)"
            >
              <div
                v-if="getCellData(section, day + 1).length"
                class="course-box"
              >
                <div
                  v-for="course in getCellData(section, day + 1)"
                  :key="course.name"
                >
                  <p>{{ course.name }}</p>
                  <p>{{ course.clazz }}</p>
                  <p>{{ course.teacherName }}</p>
                  <p>{{ course.week }}</p>
                  <br />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- 课程详情对话框 -->
  <el-dialog
    v-model="dialogVisible"
    title="课程详情"
    width="800px"
    :before-close="
      () => {
        dialogVisible = false;
        return true;
      }
    "
  >
    <el-form>
      <el-form-item
        ><p>课程名称</p>
        <br />
        <p>上课班级</p>
        <br />
        <p>授课老师</p>
        <br />
        <p>上课周数</p>
        <br
      /></el-form-item>
      <el-form-item
        v-for="course in currentCellData"
        :key="course.name"
        class="el-form-item"
      >
        <p>{{ course.name }}</p>
        <br />
        <p>{{ course.clazz }}</p>
        <br />
        <p>{{ course.teacherName }}老师</p>
        <br />
        <p>{{ course.week }}</p>
        <br />
      </el-form-item>
      <el-form-item label="选择预约类型：">
        <el-select v-model="selectedAppointmentType" @change="() => {}">
          <el-option
            v-for="type in appointmentTypes"
            :key="type"
            :label="type"
            :value="type"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="空闲周次：">
        <el-button
          v-for="week in freeWeeks"
          :key="week"
          type="default"
          :plain="selectedFreeWeeks.includes(week)"
          :style="{
            margin: '5px',
            backgroundColor: buttonClickedStatus[week] ? '#409eff' : '#d9ecff',
          }"
          @click="toggleWeekSelection(week)"
        >
          第{{ numberToChinese(week) }}周
        </el-button>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="
            () => {
              const appointments = selectedFreeWeeks.map((week) => {
                let appointment = {
                  nature: selectedAppointmentType,
                  week,
                  teacher: JSON.stringify(store.getUserIdAndName()),
                  course: JSON.stringify({
                    id: '0',
                    name: selectedAppointmentType,
                  }),
                  dayofweek: currentCellData[0].dayofweek,
                  section: currentCellData[0].section,
                  // section: currentCellData[0].section,
                  // dayofweek: currentCellData[0].dayofweek,
                  labId: (+labSelected - 900).toString(),
                  labName: labSelected,
                  semester: calendarStore.getSemester(),
                };
                console.log(appointment);
                const submitWeeks = async () => {
                  await TeacherService.addAppointmentService(appointment);
                };
                submitWeeks();
              });
              //   console.log('生成的预约信息:', appointments);
              dialogVisible = false;
            }
          "
        >
          确定
        </el-button>
      </span>
    </template>
  </el-dialog>

  <el-select
    v-model="selectedAppointmentType"
    style="display: none"
    ref="appointmentTypeSelect"
  >
    <el-option
      v-for="type in appointmentTypes"
      :key="type"
      :label="type"
      :value="type"
    ></el-option>
  </el-select>
</template>
<style scoped>
.timetable {
  padding: 10px;
  padding-top: 0;
  width: 1000px;
}
.timetable-controller .el-button {
  margin-left: 10px;
}
.timetable p,
td {
  font-size: 12px;
  text-align: center;
}
.timetable-contain {
  margin-top: 20px;
}
.course-box {
  display: inline-block;
  background: blue;
  width: 60px;
  height: 100px;
  color: white;
  border-radius: 15px;
  padding: 8px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.course-box-background {
  text-align: center;
  background: grey;
  width: 75px;
  height: 140px;
  padding: 2px;
  cursor: pointer;
}
.el-form-item-title p {
  margin-top: 10px;
  margin-right: 70px;
}
.el-form-item p {
  margin-top: 10px;
  margin-right: 50px;
}
</style>
