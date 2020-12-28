import axios from "axios";

// 创建axios实例
const _axios = axios.create({
  baseURL: "/mock"
});

// response拦截器==>处理后端返回相应
_axios.interceptors.response.use(
  response => {
    if (response) {
      if (response.data) {
        const data = response.data;
        if (data.code === 0) {
          // console.log(data['token'])
          // console.log('data');
          // console.log(data)
          return data.data
        } else {
          return Promise.reject(new Error(data.message));
        }
      } else {
        return Promise.reject(new Error("网络异常"));
      }
    } else {
      return Promise.reject(new Error("运行时异常"));
    }
  },
  error => {
    return Promise.reject(error);
  }
);

_axios.interceptors.request.use(
  request => {
    // 在发送请求之前做些什么
    // request.withCredentials = true;
    console.log(request)
    return request;
  }, 
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
});

export default _axios;
