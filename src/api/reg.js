import request from '@/utils/request.js' 
export function reg(email, username, password,companyid) { //登录接口
    const data = {
        username,
        email,
        password,
        companyid,
    }
    return request({ 
      url: '/reg',
      method: 'post',
      data: data
    })
}
export default reg;