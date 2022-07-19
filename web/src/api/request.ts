import axios from "axios";
//引入进度条
import Nprogress from "nprogress";
//引入进度条样式
import "nprogress/nprogress.css";

import { ElMessage } from "element-plus";

// switch(process.env.NODE_ENV){
//     // 生产环境，部署到服务器上的环境
//     case 'production':
//     axios.defaults.baseURL='http://api.zhengqinan.cn';
//     break;
//     //设置测式环境的接口地址
//      case 'text':
//     axios.defaults.baseURL='http://api.zhengqinantext.cn';
//     break;
//     //开发环境接口地址
//     default:
//       axios.defaults.baseURL='http://api.kaifa.cn'
//   }

let service = axios.create({
  //基础路径
  baseURL: "http://localhost:8000/api",
  //请求不能超过10S
  timeout: 10000,
  withCredentials: true,
});

service.interceptors.request.use(
  (config: any) => {
    //进度条开始
    Nprogress.start();
    let token = localStorage.getItem("token");
    token && (config.headers.Authorization = `Bearer ${token}`);
    return config;
  },
  (error) => {
    //请求失败的返回，后面的then或者catch回调随便写不写
    return Promise.reject(error);
  }
);

//响应拦截器
service.interceptors.response.use(
  (response) => {
    // 错误信息状态
    if (response.data.info == "error") {
      // 如果登录状态过期
      if (response.data.message == "jwt expired") {
        localStorage.removeItem("token");
        ElMessage.warning("用户验证登录过期，请重新登录");
        response.status = 401;
      }
      // 密码错误
      if (response.data.message == "user password error") {
        ElMessage.error("ohh，用户密码错误~");
        response.data = false;
      }
    }
    // 成功信息状态
    if (response.data.info == "success") {
      if (response.data.message == "user registration success") {
        ElMessage.success("注册成功！3秒后跳转到主页");
      }
      if (response.data.message == "login success") {
        ElMessage.success("用户登录成功！");
      }
      // 如果传回了token则保存
      if (response.data.haveToken) {
        localStorage.setItem("token", response.data.token);
      }
    }

    //进度条结束
    Nprogress.done();
    //响应成功的返回
    return response;
  },
  (error) => {
    Nprogress.done();
    //响应失败的返回
    return Promise.reject(error);
  }
);

export default service;
