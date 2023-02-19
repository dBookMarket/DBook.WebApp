/**
 * axios 请求封装
 * 2020-04-15
 */
import axios from "axios";
import { Toast } from "vant";
import { get, clear } from "./storage";
import router from "@/router";
import { addPending, removePending } from "@/utils/cancel";
// import baseURL from './baseUrl'

// 错误信息
const errorStatus = (status,error) => {
  let message = "";
  switch (status) {
    case 400:
      let _message = "Form Validate Error";
      let _desc = error.desc || ''
      let _noFieldError = error.non_field_errors?error.non_field_errors[0] :''
      let _detail = error.detail || ''
      message = `${_message}; ${_desc}${_noFieldError}${_detail}`
      break;
    case 401:
      message = "Unauthorized";
      break;
    case 403:
      message = "Forbidden";
      break;
    case 405:
      message = "Method Not Allowed";
      break;
    case 500:
      message = "System Error";
      break;
    default:
      message = `Connect Error (${status})!`;
  }
  return message;
};

// 创建axios实例
export const request = axios.create({
  timeout: 20000, // 请求超时
  baseURL: process.env.VUE_APP_BASE_API // api的基本地址
});
console.log(process.env.VUE_APP_BASE_API)
// request.defaults.withCredentials = true
// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    // 添加全局的loading...
    Toast.loading({
      message: 'loading...',
      duration: 0,
    });
    const token = get("token") || "";
    // 通过登录或者注册接口成功后，会返回一个token数据，以后每个接口header都加token，用来判断是否登录
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);
// token失效code
// 响应拦截器
request.interceptors.response.use(
  response => {
    //关闭loading
    Toast.clear()
    // 对响应数据做点什么
    const { data, status } = response;
    if (/^2[\d]{2}$/.test(status)) {
      return data?data:{code:0};
    } else {
      // 处理http错误，抛到业务代码
      const msg = errorStatus(status,response);
      Toast(msg);
      if (typeof response.data === "string") {
        response.data = { msg };
      } else {
        response.data.msg = msg;
      }
    }
    return Promise.reject(response);
  },
  error => {
    Toast.clear()
    const {status} = error.response;
    const message = errorStatus(status,error.response.data);
    Toast(message)
    return Promise.reject(error);
  }
);

// 当然也可以封装好get ,post请求

/**
 * post方法，对应post请求
 * @param { String } url [请求的url地址]
 * @param { Object } params [请求时携带的参数]
 */
export const POST = (url, params) => {
  return request.post(url, params);
};

/**
 * get方法，对应get请求
 * @param { String } url [请求的url地址]
 * @param { Object } params [请求时携带的参数]
 */
export const GET = (url, params) => {
  return request.get(url, { params });
};


/**
 * put方法，对应put请求
 * @param { String } url [请求的url地址]
 * @param { Object } params [请求时携带的参数]
 */
export const PUT = (url, params) => {
  return request.put(url, params);
};

/**
 * PATCH方法，对应patch请求
 * @param { String } url [请求的url地址]
 * @param { Object } params [请求时携带的参数]
 */
 export const PATCH= (url, params) => {
  return request.patch(url, params);
};
