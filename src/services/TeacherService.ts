import axios, { useDelete, useGet, usePost } from "@/axios";
import { type Ref } from "vue";
import { useCoursesStore } from "@/stores/TeacherStore";
import { useCourseCountStore } from "@/stores/Courses";
import { useLabsStore } from "@/stores/LabsStore";
import { useLabTableStore } from "@/stores/LabTableStore";
import { useCoursesTableCountStore } from "@/stores/CoursesTableStore";
import {useAllCoursesTableStore} from "@/stores/AllCoursesTableStore";
import { type Appointment, type Course } from "@/types/index";
import { StoreCache, ELLoading, StoreClear } from "./Decorators";
import { useCalendarStore } from "@/stores/CalendarStore";
import { ElMessage } from "element-plus";

const coursesStore = useCoursesStore();
const calendarStore = useCalendarStore();
const countStore = useCourseCountStore();
const labsStore = useLabsStore();
const labTableStore = useLabTableStore();
const semester = calendarStore.getSemester();
const courseTableStore = useCoursesTableCountStore();
const allCoursesTableStore = useAllCoursesTableStore();
export class TeacherService {
  // 获取该老师所有的课程
  @StoreCache(coursesStore.coursesS, true)
  @ELLoading()
  static async listCoursesService() {
    const semester = useCalendarStore().getSemester();
    console.log(semester);
    console.log("你将要请求老师所有的课程数据");
    const data = await useGet(`teacher/courses/${semester}`);
    return data as unknown as Ref<Course[]>;
  }

  //根据老师id获取该老师本学期的所有课程(课表)
  @StoreCache(courseTableStore.coursesTable)
  @ELLoading()
  static async listCoursesByTid() {
    const semester = useCalendarStore().getSemester();
    console.log(semester);
    const data = await useGet(`teacher/coursetable/${semester}`);
    return data as any;
  }
  @StoreCache(countStore.count, true)
  @ELLoading()
  static async getCourseCountService(courseId: any) {
    try {
      const url = `teacher/hours/${courseId}`;
      console.log("即将发起请求的URL:", url);
      const hour = await useGet(url);
      return hour as unknown as string;
    } catch (error) {
      console.error("请求课程学时信息失败，错误信息:", error);
      throw error;
    }
  }
  @StoreCache(labsStore.labs)
  @ELLoading()
  static async getLabs(courseId: any) {
    try {
      const url = `teacher/labs/${courseId}`;
      console.log("即将发起请求的URL:", url);
      const labs = await useGet(url);
      return labs as unknown as Object;
    } catch (error) {
      console.error("请求实验室信息失败，错误信息:", error);
      throw error;
    }
  }
  @StoreCache(labTableStore.labtable, true) // 强制每次请求时都重新执行
  @ELLoading()
  //@StoreClear(labTableStore.clean)
  static async getAppointmentTableByLabId(labId: any) {
    try {
      const url = `teacher/appointment/${semester}/${labId}`;
      console.log("即将发起请求的URL:", url);
      const labtable = await useGet(url);
      return labtable as unknown as Object;
    } catch (error) {
      console.error("请求实验室预约信息失败，错误信息:", error);
      throw error;
    }
  }
  static addAppointmentService = async (appointment: Appointment) => {
    try {
      const url = `teacher/appointment`;
      console.log("即将发起请求的URL:", url);
      const resp = await axios.post(url, appointment);
      if (resp.data.code < 300) {
        ElMessage.success("预约成功！");
      }
    } catch (error) {
      console.log("请求添加预约记录失败，错误信息:", error);
    }
  };
  static deleteAppointment = async (courseid: any) => {
    try {
      const url = `teacher/deleteappointment/${courseid}`;
      console.log("即将发起请求的URL:", url);
      const resp = await axios.post(url, null);
      if (resp.data.code < 300) {
        ElMessage.success("删除成功！");
      }
    } catch (error) {
      console.log("删除预约记录失败，错误信息:", error);
    }
  };
  //如果角色是老师，则可以看到本学期所有老师的所有课程(课表)
  @StoreCache(allCoursesTableStore.allCoursesTable)
  @ELLoading()
  static async listAllCourses() {
    const semester = useCalendarStore().getSemester();
    console.log(semester);
    const data = await useGet(`teacher/allteacherstable`);
    return data as any;
  };
}
