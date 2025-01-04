import { shallowRef } from "vue";
import moment from "moment";
//该学期是哪个学期,如24-1,24-2
const getSemester = () => {
  // 现在是哪几年
  var year = new Date().getFullYear();
  //   获取最后两个数
  year = year - 2000;
  console.log(year);
  // 当前月，根据这个判断是上半学期还是下半学期
  var month = +moment().format("MM");
  //上半学期
  if (month >= 3 && month <= 8) {
    return year + "-1";
  }
  //下半学期
  if (month >= 9 && month <= 12) {
    return year + "-2";
  }
  if (month >= 1 && month <= 2) {
    return year - 1 + "-2";
  }
};

//

//获取当前周
function getWeek() {
  // 现在是哪几年
  var year = new Date().getFullYear();
  // +是将字符串转成数字
  var weekofday = +moment(new Date()).format("E"); //获得今天是星期几
  var startweek;
  var millisDiff;
  // 当前月
  var month = +moment().format("MM");
  // 如果是下半年学期，如2024年9月到2024年12月;则是9月开学
  if (month >= 9 && month <= 12) {
    startweek = +moment(new Date(year + "-09-01")).format("E"); //获得今年的9月1号是星期几
    //今天到9月1号的时间戳之差
    millisDiff =
      new Date(moment().format("yyyy-MM-DD")).getTime() -
      new Date(year + "-09-01").getTime();
  }
  // 下半年学期,2025年1月到2025年2月,则开始周就是从上一年（2024）的9月开始计算了
  else if (month >= 1 && month <= 2) {
    startweek = +moment(new Date(year - 1 + "-09-01")).format("E");
    millisDiff =
      new Date(moment().format("yyyy-MM-DD")).getTime() -
      new Date(year - 1 + "-09-01").getTime();
  } else {
    //不然则是上半学期，如2025年3月到8月，3月初开学
    startweek = +moment(new Date(year + "-03-01")).format("E"); //获得今年的3月1号是星期几
    millisDiff =
      new Date(moment().format("yyyy-MM-DD")).getTime() -
      new Date(year + "-03-01").getTime();
  }

  var days =
    (millisDiff -
      weekofday * (24 * 60 * 60 * 1000) -
      (7 - startweek) * (24 * 60 * 60 * 1000)) /
    86400000;
  // console.log("现在是第" + days);
  return days / 7 + 2;
  //这里加的2代表的是本周和今年9月1号所在的那一周
}

const store = { getSemester, getWeek };
export const useCalendarStore = () => store;
