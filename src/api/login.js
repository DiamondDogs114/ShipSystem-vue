import request from '@/utils/request.js' 
 export function login(email, password,companyid) { //登录接口
  const data = {
      email,
      password,
      companyid,
  }
  return request({ 
    url: '/login',
    method: 'post',
    data: data
  })
}



export default login;