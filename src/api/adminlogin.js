import request from '@/utils/request.js' 
 export function adminlogin(usertype,aemail, apassword) { //登录接口
  const data = {
      usertype,
      aemail,
      apassword,
      
  }
  return request({ 
    url: '/adminlogin',
    method: 'post',
    data: data
  })
}



export default adminlogin;