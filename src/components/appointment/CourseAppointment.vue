<template>
  <div style="width: 300px">
    <!-- <h3>动态下拉框（修改后使用课程数据）</h3> -->
    <el-select
      v-model="selected2"
      :loading="loading"
      @change="handleSelectChange"
      placeholder="请选择你要预约的课程"
    >
      <el-option
        v-for="item in courses"
        :value="item.id"
        :label="item.name"
        :key="item.id"
      />
    </el-select>
  </div>
  <div class="course" v-if="selected2">
    <p>课程名称：{{ selectedCourse?.name }}</p>
    <p>班级：{{ selectedCourse?.clazz }}</p>
    <p>已选学时/实验学时：{{ hour }} / {{ selectedCourse?.experimentHour }}</p>
    <p>学期：{{ selectedCourse?.semester }}</p>
    <p>上课人数：{{ selectedCourse?.quantity }}</p>
    <h3 v-if="hour && selectedCourse && hour === selectedCourse.experimentHour">
      该课程学时已预约完成，可到当前预约中查看预约记录，点击下方实验室标签可以查看该实验室的所有预约情况
    </h3>
    <h3 v-else>
      该课程学时未预约完成，点击下方实验室标签可以进行课程预约并查看该实验室的所有预约情况
    </h3>
  </div>
  <div class="labs" v-if="selected2">
    <div class="lab">
      座位充足实验室：
      <el-button
        v-for="lab in goodlabs"
        :key="lab.id"
        :class="{ highlight: selectedLabIdHighlight === lab.id }"
        @click="gettables(lab.id)"
      >
        {{ lab.name }}
      </el-button>
    </div>
    <div class="lab">
      座位不够实验室：
      <el-button
        v-for="lab in badlabs"
        :key="lab.id"
        :class="{ highlight: selectedLabIdHighlight === lab.id }"
        @click="gettables(lab.id)"
      >
        {{ lab.name }}
      </el-button>
    </div>
  </div>
  <!-- <div class="table" v-if="table">
  table
  </div> -->
  <!-- <div v-if="selectedCourse && selectedLabId && timetable">
    
    <el-button
      style="margin: 5px 0 10px 0"
      type="danger"
      @click="deleteAppointment(selectedCourse.id)"
      :disabled="!selectedCourse || !selectedLabId"
    >
      删除预约
    </el-button>
  </div> -->

  <div v-if="timetable && timetable.length > 0">
    <table border="1">
      <thead>
        <tr>
          <th>节次</th>
          <th>星期一</th>
          <th>星期二</th>
          <th>星期三</th>
          <th>星期四</th>
          <th>星期五</th>
          <th>星期六</th>
          <th>星期天</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(section, index) in timetable" :key="index">
          <td>{{ index * 2 + 1 }} {{ index * 2 + 2 }}节</td>
          <td v-for="(coursesInTd, dayIndex) in section" :key="dayIndex">
            <div v-if="coursesInTd && coursesInTd.length > 0" class="tdcourses">
              <div
                v-for="course in coursesInTd"
                :key="course.name"
                class="tdcourse"
              >
                <p>
                  <strong>{{ course.name }}</strong>
                </p>
                <p>{{ course.teacherName }}</p>
                <p>{{ course.semester }}</p>
                <p>{{ course.nature }}</p>
                <p>{{ course.weeks }}</p>
              </div>
              <el-button
                @click="
                  appointmentCourse(index, dayIndex, coursesInTd),
                    openDialog(index, dayIndex, coursesInTd)
                "
                >点击预约</el-button
              >
            </div>

            <div class="tdnoappointment" v-else>
              <!-- <p>无预约</p> -->
              <el-button
                @click="
                  appointmentCourse(index, dayIndex, []),
                    openDialog(index, dayIndex, [])
                "
                >点击预约</el-button
              >
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="请选择你要预约的周次"
    @close="selectedWeeks = []"
  >
    <p>当前课程：{{ selectedCourse?.name }}</p>
    <p>当前星期：{{ currentDay }}</p>
    <p>当前节次：{{ currentSection }}</p>

    <el-checkbox-group v-model="selectedWeeks" @change="handleWeekCheck">
      <el-checkbox
        v-for="week in allWeeks"
        :label="week"
        :key="week"
        :disabled="isWeekDisabled(week)"
        >第{{ week }}周</el-checkbox
      >
    </el-checkbox-group>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          type="primary"
          @click="submitWeeks"
          :disabled="!hasSelectedWeeks"
          >提交</el-button
        >
      </span>
    </template>
  </el-dialog>
  <!-- <div v-else>
    <p>先选课程再进行预约</p>
  </div> -->
</template>

<script setup lang="ts">
import { type Ref, ref, reactive, nextTick, onMounted } from "vue";
import type { Course, Appointment, User } from "@/types/index";
import { TeacherService } from "@/services/TeacherService";
import { ElDialog, ElCheckbox, ElCheckboxGroup } from "element-plus";
//数据
//选中的周次合理
const selectedValidWeek = ref(false);
//输入框的值
const selected2 = ref("");
//被选中的课程
const selectedCourse = ref<Course>();
// 用于存储选中的周次，初始化为空数组v
const selectedWeeks = ref<number[]>([]);
// 控制模态框是否显示的响应式数据
const dialogVisible = ref(false);
// 生成1-18周的数组
const allWeeks = Array.from({ length: 18 }, (_, i) => i + 1);
// 用于记录当前课程已有的周次，根据实际情况填充
const appointmentWeeks = ref<number[]>([]);
//记录当前节次
const currentSection = ref();
//记录当前星期
const currentDay = ref();
//是否处于加载状态
const loading = ref(true);
//课程数组
let courses: Ref<Course[]> = ref([]);
//已选学时
let hour = ref();
//S实验室信息
let data = ref();
//人数够实验室
let goodlabs = ref();
//人数不够实验室
let badlabs = ref();
//指定实验室的预约信息
let appointmentTable = ref();
//处理后的预约表
let timetable = ref();
const selectedLabIdHighlight = ref(""); // 用于记录当前高亮显示的实验室id
// 记录当前所选实验室的 id
const selectedLabId = ref("");
// 记录当前所选实验室的 name
const selectedLabName = ref("");
//一个td中要渲染的课程数组
//const tdcourses = ref();
//const currentteacherName = ref("");
//判断提交按钮是否有效
const hasSelectedWeeks = ref(false);
//方法
//删除预约请求
async function deleteAppointment(courseId: any) {
  try {
    await TeacherService.deleteAppointment(courseId);
    console.log("**********");
    //console.log(courses.value);
    //loading.value = false;
    location.reload(); // 刷新页面
  } catch (error) {
    console.error("Error:", error);
  }
}
//控制模态框
const openDialog = (section: any, dayofweek: any, tdcourses: any) => {
  if (
    selectedCourse.value &&
    selectedCourse.value.experimentHour !== hour.value.value
  ) {
    dialogVisible.value = true;
    //已经被选的周次
    if (tdcourses && tdcourses.length > 0) {
      tdcourses.forEach((course) => {
        course.weeks.forEach((week) => {
          appointmentWeeks.value.push(week);
        });
      });
    }
    // 设置当前节次和星期
    currentSection.value = section + 1;
    currentDay.value = dayofweek + 1;
    console.log("节次和周", currentSection, currentDay);
  }
};
// 动态计算是否禁用某个周次按钮
const isWeekDisabled = (week: number) => {
  const validWeek = Math.floor(
    (selectedCourse.value?.experimentHour - hour.value) / 2
  );
  // 如果已选的周次达到 validWeek，且当前周次未被选中，则禁用
  return (
    (selectedWeeks.value.length >= validWeek &&
      !selectedWeeks.value.includes(week)) ||
    appointmentWeeks.value.includes(week)
  );
};
// 更新选中周次逻辑
const handleWeekCheck = (val: number[]) => {
  console.log("当前选中的周次：", val);
  selectedWeeks.value = val; // 更新选中的周次数组
  hasSelectedWeeks.value = val.length > 0; // 根据选中周次的数量来更新按钮可用状态

  const validWeek = Math.floor(
    (selectedCourse.value?.experimentHour - hour.value) / 2
  );
  console.log("可选的最大周次数量：", validWeek);

  // 更新选中状态
  selectedValidWeek.value = val.length >= validWeek;
};
//提交 5、添加预约请求
const submitWeeks = async () => {
  // 这里可以添加逻辑将selectedWeeks.value发送到后端或者进行其他处理
  dialogVisible.value = false;
  console.log("选中的周次：", selectedWeeks.value);

  if (
    selectedCourse.value &&
    selectedWeeks.value.length > 0 &&
    selected2.value
  ) {
    const userInfoStr = sessionStorage.getItem("user");
    if (userInfoStr) {
      try {
        const userInfo = JSON.parse(userInfoStr);
        if (typeof userInfo.name === "string") {
          const teacher: User = {
            id: selectedCourse.value.teacherId, // 假设课程对象中有 teacherId 属性，根据实际情况调整
            name: userInfo.name,
          };
          const course: Course = {
            id: selectedCourse.value.id,
            name: selectedCourse.value.name,
          };

          const appointmentData: Appointment = {
            teacher: JSON.stringify(teacher),
            course: JSON.stringify(course),
            labId: selectedLabId.value,
            labName: selectedLabName.value,
            semester: selectedCourse.value.semester,
            nature: "课程预约",
            week: 0,
            dayofweek: currentDay.value,
            section: currentSection.value,
          };

          // 遍历选中的周次，逐个发送预约请求
          for (const week of selectedWeeks.value) {
            appointmentData.week = week;
            await TeacherService.addAppointmentService(appointmentData);
          }
          // 提交成功后刷新页面
          location.reload(); // 刷新页面
        } else {
          console.error(
            "从 sessionStorage 获取的用户信息中缺少有效的 name 属性"
          );
        }
      } catch (error) {
        console.error("解析 sessionStorage 中用户信息失败，错误信息:", error);
      }
    } else {
      console.error("sessionStorage 中不存在用户信息");
    }
  } else {
    console.error("缺少必要的信息，无法发起预约请求");
  }
};
//下拉框值改变时调用
const selectChange = (val: any) => {
  console.log("selectChange:", val);
  const foundCourse = courses.value.find((course) => course.id === val);
  selectedCourse.value = foundCourse;
  console.log(selectedCourse.value);
  console.log("11111111111");
  console.log(selected2.value);
};
//处理下拉框选择事件变化
const handleSelectChange = (val: any) => {
  selectChange(val);
  getHours(val); //调用2
  getLabs(val); //调用3
};
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
//2、获取当前课程已选学时
async function getHours(id: any) {
  try {
    console.log("888888888");
    console.log(id);
    const result = await TeacherService.getCourseCountService(id);
    hour.value = result !== null ? result : "0";
    console.log("6666666666");
    console.log(hour.value);
  } catch (error) {
    console.error("Error:", error);
  }
}
//3、基于课程获取实验室信息
async function getLabs(id: any) {
  try {
    data.value = await TeacherService.getLabs(id);
    console.log("777777777");
    console.log(data.value.value);
    console.log(typeof data.value);
    const { 座位充足实验室, 座位不够实验室 } = data.value.value;
    goodlabs.value = 座位充足实验室;
    badlabs.value = 座位不够实验室;
    console.log("goodlabs:", goodlabs.value);
    console.log("badlabs:", badlabs.value);
  } catch (error) {
    console.error("Error:", error);
  }
}
//4、基于实验室获取预约表信息
async function getAppointmentTable(labId: any) {
  try {
    appointmentTable.value = await TeacherService.getAppointmentTableByLabId(
      labId
    );
    //console.log("9999999")
    console.log("返回的预约表数据：", appointmentTable.value.value);
    timetable.value = processAppointmentData(appointmentTable.value.value);
    nextTick(() => {
      console.log("DOM 已更新，课表数据已渲染", timetable.value);
    });
    // console.log("处理后的课表数据",timetable.value);
  } catch (error) {
    console.error("Error:", error);
  }
}
// 数据处理函数：将预约数据转换为课表格式
const processAppointmentData = (appointments: Appointment[]) => {
  const timetable: any = Array(6)
    .fill(null)
    .map(() => Array(7).fill(null));
  console.log("22222222222");
  console.log(appointments);
  // 处理预约数据
  appointments.forEach((appointment) => {
    // console.log(appointment.teacher);
    console.log(appointment.course);
    console.log(typeof appointment.course);
    const teacher = JSON.parse(appointment.teacher) as User;
    const course = JSON.parse(appointment.course) as Course;
    const { id: courseId, name: courseName } = course;
    console.log(courseId, courseName);
    const { id: teacherId, name: teacherName } = teacher;
    console.log(teacherId, teacherName);
    // console.log(appointment.dayofweek);
    // console.log(appointment.section);

    const week = appointment.week;

    const day = appointment.dayofweek - 1; // 转换为 0 索引
    const section = appointment.section - 1; // 转换为 0 索引
    console.log(`处理课程：${courseName}`);
    console.log(`section: ${section}, day: ${day}`);

    if (section >= 0 && section < 6 && day >= 0 && day < 7) {
      if (timetable[section][day]) {
        const existingCourses = timetable[section][day];
        const targetCourseIndex = existingCourses.findIndex(
          (element: any) => element.name === courseName
        );
        if (targetCourseIndex !== -1) {
          // 相同课程，合并周次
          if (!existingCourses[targetCourseIndex].weeks.includes(week)) {
            existingCourses[targetCourseIndex].weeks.push(week);
          }
        } else {
          // 不同课程，新增课程到数组
          existingCourses.push({
            name: courseName,
            teacherName: teacherName,
            semester: appointment.semester,
            nature: appointment.nature,
            weeks: [week],
          });
        }
      } else {
        timetable[section][day] = [
          {
            name: courseName,
            teacherName: teacherName,
            semester: appointment.semester,
            nature: appointment.nature,
            weeks: [week],
          },
        ];
      }
    } else {
      console.error("无效的section或day:", section, day);
    }
  });
  console.log("处理后的课表数据：", timetable);

  return timetable;
};

//点击实验室标签时调用4,渲染预约表
const gettables = (val: any) => {
  console.log(val);
  selectedLabId.value = val;
  selectedLabIdHighlight.value = val; // 更新选中的高亮实验室id
  const lab = [...goodlabs.value, ...badlabs.value].find(
    (lab) => lab.id === val
  );
  if (lab) {
    selectedLabName.value = lab.name;
  }
  getAppointmentTable(val);
  //table.value = true;
};
//const table = ref(false);
//选中td时调用
// 选中td时调用
const appointmentCourse = (section: any, dayofweek: any, tdcourses: any) => {
  console.log("你选中的星期是", dayofweek + 1);
  console.log("你选中的节次是", section + 1);
  // 检查 weeks 是否为空，如果不为空则打印其内容
  if (tdcourses && tdcourses.length > 0) {
    tdcourses.forEach((element) => {
      element.weeks.forEach((week) => {
        console.log("已经被选的周次是", week);
      });
    });
  } else {
    console.log("目前没有没有选中的周次");
  }
  console.log(selectedCourse.value.experimentHour);
  console.log(hour.value.value);
  if (
    selectedCourse.value &&
    selectedCourse.value.experimentHour === hour.value.value
  ) {
    console.log("11111111111111111111");

    window.alert("当前课程学时已预约完成，请先移除预约记录再进行预约");
    //dialogVisible.value = false;
  }
};
</script>
<style scoped>
.lab {
  margin: 10px 0;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  width: 150px; /* 设置单元格宽度 */
  height: 100px; /* 设置单元格高度 */
  text-align: center; /* 让内容居中 */
  vertical-align: middle; /* 让内容垂直居中 */
  border: 1px solid #ccc; /* 添加边框，便于查看效果 */
  box-sizing: border-box; /* 确保 padding 不影响宽高 */
}
th {
  background-color: #f4f4f4;
}
td div {
  padding: 5px;
  cursor: pointer;
  /* border: 1px solid blue; */
}
.highlight {
  background-color: #007bff; /* 设置背景颜色为蓝色，你可以根据需求调整颜色值 */
  color: white; /* 设置文字颜色为白色，与背景色搭配，同样可按需调整 */
}
.tdcourses {
  padding: 10px;
  /* border: 1px solid red; */
}
.tdcourse {
  background-color: aquamarine;
  margin: 10px;
}
.tdnoappointment {
  /* border: 1px solid red; */
  padding: 10px;
}
</style>
