import { defineStore } from 'pinia';
import loginApi from '../api/login.js';
import router from "../router/";
import regApi from "../api/reg.js";
import adminloginApi from '../api/adminlogin.js';

export const useUserStore = defineStore({
  id: 'user',
  state: () => ({
    user: {
      userid: null,
      username: null,
      email: null,
      password: null,
      companyid:null,
      phone:null,
      companyname:null,
      realname:null,
    },
    token: null,
    admin:{
      adminid:null,
      adminname:null,
      usertype:null,
      aemail:null,
      aphone:null,
      adminrealname:null,

    },
    admintoken:null,
    errormessage:'',
    
    snackbar: {
      show: false,
      message: '',
      color: 'error',
      timeout: 3000,
      showClose: true,
      
    },
  }),
  actions: {
    async login({ email, password, companyid }) {
      try {
         
        const response = await loginApi( email, password, companyid );
       
      
        // 更新 store 中的用户信息和 token
        this.user = response.data;
        
        this.token = response.data.token;
        window.localStorage.setItem('user', JSON.stringify(this.user));
        window.localStorage.setItem('token', this.token);
        document.title = "海运万事通";
        // 在实际应用中，你可能还需要将 token 保存到 localStorage 中，以便在页面刷新后仍然保持登录状态
        console.log("user",this.user)
        
        router.push('/index');
      } catch (error) {
        
        this.snackbar.show = true;
        this.snackbar.message = '登录失败: ' + error.response.data.errormessage;
        console.log("error",this.errormessage)
        throw error; 
      }
    },
    async reg({ email,username, password, companyid }) {
      try {
        const response = await regApi( email, username,password, companyid );
        

       
        router.push('/');
        
        this.snackbar.show = true;
        this.snackbar.color = 'success';
        this.snackbar.message = '注册成功！';
      } catch (error) {
        // 注册失败
        // console.error('注册失败:', error);
        // console.log('Login response:', response);
        this.snackbar.show = true;
        this.snackbar.color = 'error';
        this.snackbar.message = '注册失败: ' + error.response.data;
        throw error; 
      }
    },
    async adminlogin({ usertype, aemail, apassword  }) {
      try {
        const response = await adminloginApi(  usertype, aemail, apassword );
       
        
        // 更新 store 中的用户信息和 token
        this.admin = response.data;
        
        this.admintoken = response.data.admintoken;
        window.localStorage.setItem('admin', JSON.stringify(this.admin));
        window.localStorage.setItem('admintoken', this.admintoken);
        document.title = "后台管理";
        const storedUser = JSON.parse(localStorage.getItem('admin'));
        if(storedUser.usertype==3){
          router.push('/chatforadmin')
        }else{
          router.push('/adminindex');
        }     
      } catch (error) {
        // 登录失败
        // console.error('登录失败:', error);
        // console.log('Login response:', response);
        
        this.snackbar.show = true;
        this.snackbar.message = '登录失败: ' + error.response.data.errormessage;
        throw error; 
      }
    },
    showSnackbar(message, color ) {
      this.snackbar.show = true;
      this.snackbar.message = message;
      this.snackbar.color = color;
    },
  },
});
export default useUserStore