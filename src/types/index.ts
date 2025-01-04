// element-plus的校验规则
export interface RuleForm {
  account: string;
  password: string;
}

// 结果类型
export interface ResultVO<T> {
  code: number;
  message?: string;
  data: T;
}

// 用户
export interface User {
  id?: string;
  name?: string;
  account?: string;
  password?: string;
  telephone?: string;
  createTime?: string;
  updateTime?: string;
}

// 课程

export interface Course {
  id?: string;
  name?: string;
  quantity?: number;
  semester?: string;
  clazz?: string;
  type?: number;
  teacherId?: string;
  experimentHour?: number;
}
//预约表
export interface Appointment {
  id?: string;
  teacher?: string;
  course?: string;
  labId?: string;
  labName?: string;
  semester?: string;
  nature?: string;
  week?: number;
  dayofweek?: number;
  section?: number;
}
// 周
export interface Week {
  week: number;
  weekofday: number;
  course?: Course[];
}
//预约表1(包含课程)
export interface Courseappointment {
  course: Course;
  appointment: Appointment;
}

//
