<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useCalendarStore } from "@/stores/CalendarStore";
import { TeacherService } from "@/services/TeacherService";
import { ElMessageBox } from "element-plus";

// 数据与状态
const weekOfDays = [0, 1, 2, 3, 4, 5, 6]; // 一周天数
const calendarStore = useCalendarStore();
const currentWeek = calendarStore.getWeek(); // 当前周次

const weeks = ref<any[]>([]); // 所有周次数据
const weekSelected = ref<any[]>([]); // 当前选中课程数据
const selectedButton = ref(currentWeek); // 当前选中的按钮
const isTotalTable = ref(false); // 是否为总课表模式
const modalData = ref<any[]>([]); // 模态框显示的课程数据

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
  ];
  return identifier === "week" && (n === 0 || n === 7) ? "日" : chnArr[n];
};

// 获取课程数据并整理
const fetchData = async () => {
  try {
    const response = await TeacherService.listCoursesByTid();
    const courses = response.value;

    // 整理课程数据到周次
    const weeksMap: Record<number, any[]> = {};

    courses.forEach(
      ({
        appointment: { week, dayofweek, labName, section },
        course: { clazz, name },
      }) => {
        if (!weeksMap[week]) {
          weeksMap[week] = [];
        }
        weeksMap[week].push({
          dayofweek,
          clazz,
          name,
          labName,
          section,
        });
      }
    );
    weeks.value = Object.entries(weeksMap).map(([week, courses]) => ({
      week: Number(week),
      courses,
    }));

    chooseWeek(currentWeek); // 默认选择当前周次
  } catch (error) {
    console.error("Error fetching courses:", error);
  }
};

// 切换周次
const chooseWeek = (week: number) => {
  const selectedWeek: any = weeks.value.find((w: any) => w.week === week);
  weekSelected.value = selectedWeek ? selectedWeek.courses : [];
  isTotalTable.value = false;
};

// 显示所有课程
const selectAll = () => {
  selectedButton.value = 0; // 设置选中“总课表”按钮
  weekSelected.value = weeks.value.flatMap((week: any) => week.courses); // 合并所有课程
  isTotalTable.value = true; // 设置为总课表模式
};

// 根据周次切换
const selectButton = (number: number) => {
  selectedButton.value = number;
  chooseWeek(number);
};

// 获取指定格子的课程
const getCellData = (weekSection: number, weekOfDay: number) => {
  return weekSelected.value.filter(
    (course: any) =>
      course.dayofweek === weekOfDay && course.section === weekSection
  );
};

// 显示模态框
const showModal = (weekSection: number, weekOfDay: number) => {
  const cellData = getCellData(weekSection, weekOfDay);
  if (cellData.length > 0) {
    modalData.value = cellData;
    ElMessageBox({
      title: "课程详情",
      message: `<div>
        ${modalData.value
          .map(
            (course: any) =>
              `<p>课程名：${course.name}<br>班级：${course.clazz}<br>实验室：${course.labName}</p><br>`
          )
          .join("")}
      </div>`,
      dangerouslyUseHTMLString: true,
      confirmButtonText: "关闭",
    });
  }
};

// 初始化数据
onMounted(fetchData);
</script>

<template>
  <div class="timetable">
    <div class="timetable-controller">
      <!-- 总课表按钮 -->
      <el-button
        class="el-button"
        size="large"
        style="margin-top: 20px; margin-left: 15px"
        :type="selectedButton === 0 ? 'primary' : 'default'"
        :plain="selectedButton !== 0"
        @click="selectAll"
      >
        总课表
      </el-button>

      <!-- 按周次选择按钮 -->
      <el-button
        v-for="number in 19"
        :key="number"
        class="el-button"
        size="large"
        style="margin-top: 20px; margin-left: 15px"
        :type="number === selectedButton ? 'primary' : 'default'"
        :plain="number !== selectedButton"
        @click="selectButton(number)"
      >
        {{ number === currentWeek ? "本周" : `第${number}周` }}
      </el-button>
    </div>

    <!-- 课表展示 -->
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
              @click="showModal(section, day + 1)"
            >
              <div
                v-if="getCellData(section, day + 1).length"
                class="course-box"
              >
                <div
                  v-for="course in getCellData(section, day + 1)"
                  :key="course.name"
                  class="course-item"
                >
                  <!-- {{ course.name }} | {{ course.clazz }} | {{ course.labName }} -->
                  <p>{{ course.name }}</p>
                  <p>{{ course.clazz }}</p>
                  <p>{{ course.labName }}</p>
                  <br />
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
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
  background: #d9ecff;
  width: 60px;
  height: 100px;
  color: black;
  border-radius: 15px;
  padding: 8px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.course-item {
  margin: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.course-box-background {
  text-align: center;
  background: rgb(241, 241, 241);
  width: 75px;
  height: 140px;
  padding: 2px;
  cursor: pointer;
}
.el-button:focus {
  background: #409eff;
  border-color: #409eff;
  color: aliceblue;
}
</style>