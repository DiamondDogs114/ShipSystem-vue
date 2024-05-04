import axios from 'axios';
import apiConfig from '../api/config';


const request = axios.create({
  baseURL: apiConfig.baseUrl,
  timeout: 15000,
});

// request 拦截器
// 可以自请求发送前对请求做一些处理
// 比如统一加token，对请求参数统一加密
request.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  const admintoken=localStorage.getItem('admintoken')
  if(token){
     config.headers['Authorization'] = `Bearer ${token}`;
  }
  if(admintoken){
    config.headers['Authorization'] = `Bearer ${admintoken}`;
 }
 
  const tokentest = window.localStorage.getItem("token");
  console.log("Token from localStorage:", tokentest);
  const tokentestadmin = window.localStorage.getItem("admintoken");
  console.log("Token from localStorage:", tokentestadmin);// 设置请求头
  return config;
}, error => {
  return Promise.reject(error)
});



export default request;