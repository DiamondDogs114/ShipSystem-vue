<script setup>
import useUserstore from '../stores/user.js';
import { ref } from 'vue'
const store = useUserstore();
const email = ref();
const password = ref();
const userTypevalue = ref();

const isFormValid = ref(true);
const adminloginFormRef = ref();
const loading = ref(false);

const adminlogin = async () => {
  loading.value = true;
  setTimeout(() => (loading.value = false), 3000);

  const { valid } = await adminloginFormRef.value.validate();
  if (valid) {


    // 发送登录请求到后端
    store.adminlogin({ usertype: userTypevalue.value, aemail: email.value, apassword: password.value });
  } else {
    console.log("noadminlogin");
  }

}


</script>
<template>
  <div class="flower">
     <img src="@/assets/flower.png">
     <img src="@/assets/flower.png">
     <img src="@/assets/flower.png">
     <img src="@/assets/flower.png">
     <img src="@/assets/flower.png">
     <img src="@/assets/flower.png">
     <img src="@/assets/flower.png">
     <img src="@/assets/flower.png">
  </div>
  <v-card class="login_container">
    <img src="@/assets/Frame-c100fb2f.png" alt="alt" class="frame" />
    <div class="group">
      <v-card class="form">
        <v-form ref="adminloginFormRef" lazy-validation v-model="isFormValid">
          <div class="text-h4 mb-1">👋 Welcome!</div>
          <div class="mt-1">
            <div style="font-weight: 700">用户类型</div>
            <v-select v-model="userTypevalue" variant="outlined" :items="options" :rules="Selectrule"
              @keyup.enter="adminlogin" density="compact" clearable item-title="state" placeholder="选择用户类型"
              item-value="abbr" hide-details></v-select>
          </div>
          <div class="my-1">
            <div style="font-weight: 700">邮箱</div>
            <v-text-field v-model="email" :rules="emailRules" @keyup.enter="adminlogin" variant="outlined"
              density="compact" clearable hide-details placeholder="输入邮箱"></v-text-field>
          </div>
          <div class="mb-5">
            <div style="font-weight: 700">密码</div>
            <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
              :type="visible ? 'text' : 'password'" @click:append-inner="visible = !visible" color="primary"
              placeholder="填写密码,需至少8位" :rules="passwordRules" @keyup.enter="adminlogin" variant="outlined"
              density="compact" clearable hide-details></v-text-field>
          </div>
          <div style="text-align: right">
            <v-btn color="primary" append-icon="mdi-arrow-right" size="large" variant="tonal" :loading="loading"
              @click="adminlogin">Go
              !</v-btn>
          </div>
        </v-form>
      </v-card>
      <v-card class="desc">
        <div class="logo mt-4">
          <img src="@/assets/toby.jpg" height="60" />
          <div class="text-h5 mt-2"><strong class="mr-2">海运</strong>万事通</div>
          <h5>管理员系统</h5>
        </div>
        <div class="mt-4">
          基于Springboot+Vue制作
        </div>
        <div class="mt-4">
          Build by
          <p style="
                          color: rgba(
                              var(--v-theme-on-background),
                              var(--v-high-emphasis-opacity)
                          );
                      ">2210122葛邵俊 ❤️</p>
        </div>
        <router-link to="/login">
        <v-btn size="large" class="d-flex mx-auto mt-3" color="red" variant="tonal" width="170" append-icon="mdi-arrow-left"> 
          返回客户登录
            </v-btn>
        </router-link> 
      </v-card>
    </div>
  </v-card>
</template>

<script>
export default {

  data: () => ({


    options: [
      { state: '销售', abbr: '1' },
      { state: '单证员', abbr: '2' },
      { state: '客服', abbr: '3' },

    ],
    visible: false,

    emailRules: [
      v => !!v || "不能为空",
      v => /.+@.+\..+/.test(v) || "E-mail必须合法填写",
    ],
    passwordRules: [
      value => !!value || '不能为空！',
      v => v.length >= 8 || '最少8个字节',


    ],
    Selectrule: [
      v => !!v || "不能为空",

    ],
    phoneRules: [
      v => !!v || "不能为空",
      v => v.length >= 11 || '最少11个数字',
    ],

  }),


  computed: {
    currentTitle() {
      switch (this.step) {
        case 1:
          return '管理员登录'
        case 2:
          return '找回密码'
        default:
          return '管理员登录'
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.flower{
position: absolute;
width: 100%;
height: 100vh;
overflow: hidden;
z-index: 1;
pointer-events: none;


}
.flower img{

   position:absolute;

}

@keyframes animate {
  0%{
   opacity: 0; top:-10px;
   transform: translateX(20px)rotate(0deg);
  }
  10%{
    opacity: 1;
  }
  20%{
    transform: translateX(-20px)rotate(45deg);
  }
  40%{
    transform: translateX(-20px)rotate(90deg);
  }
  60%{
    transform: translateX(20px)rotate(180deg);
  }
  80%{
    transform: translateX(-20px)rotate(45deg);
  }
  100%{
    top:110%;transform: translateX(20px)rotate(225deg);
  }
}
.flower img:nth-child(1){
  left: 20%;
  animation: animate 20s linear infinite;
}
.flower img:nth-child(2){
  left: 50%;
  animation: animate 14s -2s linear infinite;
}
.flower img:nth-child(3){
  left: 70%;
  animation: animate 12s -3s linear infinite;
}
.flower img:nth-child(4){
  left: 5%;
  animation: animate 15s -2s linear infinite;
}
.flower img:nth-child(5){
  left: 85%;
  animation: animate 18s -1s linear infinite;
}
.flower img:nth-child(6){
  left: 90%;
  animation: animate 12s -1s linear infinite;
}
.flower img:nth-child(7){
  left: 15%;
  animation: animate 14s -2s linear infinite;
}
.flower img:nth-child(8){
  left: 60%;
  animation: animate 15s -1s linear infinite;
}
.login_container {
  height: 100vh;
  overflow-y: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s;
  position: relative;
  overflow: hidden;

  .frame {
    position: absolute;
    left: -5%;
    top: -5%;
    width: 110%;
    height: 110%;
    
  }

  .group {
    display: flex;
    position: relative;
    z-index: 1;
    border-radius: 20px;
    overflow: hidden;

    .form {
      width: 360px;
      margin: 0 auto;
      height: 400px;
      padding: 60px;
      backdrop-filter: saturate(200%) blur(3px);
      background-color: rgba(255, 255, 255, 0.25);
      gap:20px;

      .title {
        font-size: 36px;
        font-weight: 700;
        font-family: Roboto, sans-serif !important;
        margin-bottom: 20px;
      }
    }

    .desc {
      height: 100%;
      margin: 0 auto;
      width: 360px;
      // backdrop-filter: saturate(200%) blur(3px);
      // background-color: rgba(255, 255, 255, 0.25);
      background-image: linear-gradient(to bottom, #9796f0, #fbc7d4);
      height: 400px;
      padding: 60px;
      text-align: center;

      .logo {
        text-align: center;
      }
    }
  }
}

@media only screen and (max-width: 778px) {
  .login_container {
    .group {
      .form {
        background: transparent;
      }

      .desc {
        display: none;
      }
    }
  }
}
</style>
