import { ElLoading } from "element-plus";
export const createElLoading = (msg: string = "Loading") => {
  console.log("正在加载");
  return ElLoading.service({
    lock: true,
    text: msg,
    background: "rgba(0, 0, 0, 0.7)",
  });
};
