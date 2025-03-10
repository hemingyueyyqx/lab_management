// 日期对象格式化转换
import dayjs from "dayjs";//dayjs 是一个轻量级的 JavaScript 日期处理库，用于解析、验证、操作和显示日期和时间。
import relativeTime from "dayjs/plugin/relativeTime";//导入了 dayjs 的 relativeTime 插件。该插件可以让 dayjs 支持计算相对时间，例如 “几分钟前”“几小时前” 等。
import "dayjs/locale/zh-cn"; // import locale//导入了 dayjs 的中文语言包，以便后续将日期时间的显示语言设置为中文。
//dayjs.extend() 是 dayjs 提供的用于扩展功能的方法。这里传入 relativeTime 插件，将该插件的功能集成到 dayjs 中，使得 dayjs 实例可以使用相对时间计算的相关方法。
dayjs.extend(relativeTime);
//dayjs.locale() 方法用于设置 dayjs 的语言环境。这里将语言环境设置为 zh-cn，即中文（中国）。这样，在使用 dayjs 进行日期格式化和显示时，会以中文的形式呈现，例如相对时间会显示为 “几分钟前”“几小时前” 等，而不是英文的 “a few minutes ago”“a few hours ago” 。
dayjs.locale("zh-cn"); // use locale

// 显示几天前
export function timeAgo(valueTime) {
  return dayjs(valueTime).fromNow();
}

// 转换为指定格式
export function timeFormatConversion(valueTime, format) {
  return dayjs(valueTime).format(format);
}

// 显示全部时间范围
export function timeFullRange(startTime, endTime) {
  return (
    dayjs(startTime).format("YYYY-MM-DD HH:mm") +
    "至" +
    dayjs(endTime).format("YYYY-MM-DD HH:mm")
  );
}

// 时间_用于文件名
export function timeFile() {
  return dayjs(new Date()).format("YYYY_MM_DD_HH_mm_ss");
}

// 字符串转日期
export function strToDate(valueTime) {
  // console.log(valueTime)
  return dayjs(valueTime).toDate();
}

// 字符串(只有时分秒)转日期
export function strTimeToDate(valueTime) {
  return dayjs("2023-01-01 " + valueTime).toDate();
}

// 比较日期差值
export function diffDate(value1, value2) {
  let a = dayjs(value1);
  let b = dayjs(value2);
  return b.diff(a, "day");
}

// 比较日期差分钟值
export function diffDateMinute(value1, value2) {
  let a = dayjs(value1);
  let b = dayjs(value2);
  return b.diff(a, "minute");
}

// 比较日期差分钟值
export function lastMinute() {
  let time = dayjs().subtract(1, "minutes");
  return [
    dayjs(time).format("YYYY-MM-DD HH:mm:00"),
    dayjs(time).format("YYYY-MM-DD HH:mm:59"),
  ];
}
