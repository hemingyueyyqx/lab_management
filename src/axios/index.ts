import type { ResultVO } from "@/types";
import axios from "axios";
import { ElMessage } from "element-plus";

// 配置了 axios.defaults.baseURL，默认使用 /api/ 作为基地址。
axios.defaults.baseURL = "/api/";

// 请求拦截器
axios.interceptors.request.use(
  (req) => {
    const auth = sessionStorage.getItem("token");
    // 判断,用于避免header包含authorization属性但数据值为空
    if (auth && req.headers) {
      req.headers.token = auth;
    }
    return req;
  },
  (error) => {
    return Promise.reject(new Error("请求失败！" + error));
  }
);

// 递归实现反序列化为JS对象
const parseObject = (data: any) => {
  let newValue = data;

  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Array) {
      value.forEach((d) => {
        parseObject(d);
      });
    }
    if (typeof value == "object") {
      parseObject(value);
    }

    if (
      typeof value == "string" &&
      (value.includes('{"') || value.includes("["))
    ) {
      try {
        newValue = JSON.parse(value);
        if (typeof newValue == "object") {
          data[key] = parseObject(newValue);
        }
      } catch (error) {
        //
      }
    }
  }
  return newValue;
};

// 响应拦截器
axios.interceptors.response.use(
  (resp) => {
    console.log("到响应拦截器辣！");
    if (resp.config.responseType == "blob") {
      return resp;
    }

    const data: ResultVO<{}> = resp.data;
    console.log(resp.data);
    console.log(data.code);
    if (data.code < 300) {
      // 将resp.data转成对象
      // parseObject(resp.data);
      //console.log("这里是登陆成功~");
      // console.log(resp);
      // console.log(resp.data);
      // ElMessage.success("登录成功！！")
      return resp;
    }

    if (data.code >= 400) {
      //ElMessage.error( data.message);
      return Promise.reject(data.message);
    }
    return resp;
  },
  // 全局处理异常信息。即，http状态码不是200
  (error) => {
     ElMessage.error("error!!!")
    return Promise.reject(error.message);
  }
);

//提供了一组异步函数：useGet、usePost、usePut、usePatch 和 useDelete，分别封装了对应的 HTTP 方法。
export const useGet = async <T>(url: string) => {
  const resp = await axios.get<ResultVO<T>>(url);
  return resp.data.data;
};

export const usePost = async <T>(url: string, data: unknown) => {
  const resp = await axios.post<ResultVO<T>>(url, data);
  return resp.data.data;
};

export const usePut = async <T>(url: string) => {
  const resp = await axios.put<ResultVO<T>>(url);
  return resp.data.data;
};

export const usePatch = async <T>(url: string, data: unknown) => {
  const resp = await axios.patch<ResultVO<T>>(url, data);
  return resp.data.data;
};

export const useDelete = async <T>(url: string) => {
  const resp = await axios.delete<ResultVO<T>>(url);
  return resp.data.data;
};

export default axios;
