<script setup>
import useUserstore from '../stores/user.js';
import { ref } from 'vue'
const store = useUserstore();
const email = ref();
const username = ref();
const password = ref();
const companyid = ref();
const isFormValid = ref(true);
const regFormRef = ref();
const loading = ref(false);

const Reg = async () => {
  loading.value = true;
  setTimeout(() => (loading.value = false), 3000);
  const { valid } = await regFormRef.value.validate();
  if (valid) {
    
  
    // 发送登录请求到后端
    store.reg({  email: email.value, username: username.value, password: password.value, companyid: companyid.value });
  }else{
    console.log("noReg");
  }
    
}
  

</script>
<template>
  <div class="site">
    <div class="hero">
      <h1>海运<strong class="ml-3">万事通</strong><p class="text-h6">你最好的海运物流管家.</p> </h1>  
    </div>
    
    <div class="container">

      <v-card class=" pa-12 pb-8" flat max-width="448" rounded="lg">
        <v-card-title class="my-4 text-h4">
          <span class="flex-fill">注册 </span>
        </v-card-title>
        <v-card-subtitle>注册一个新账号</v-card-subtitle>
        <v-form ref="regFormRef" lazy-validation v-model="isFormValid">
          <div class="text-subtitle-1 text-medium-emphasis " style="margin-top: 30px;">邮箱</div>

          <v-text-field v-model="email" density="compact" placeholder="填写邮箱" :rules="emailRules"
            prepend-inner-icon="mdi-email-outline" variant="outlined" @keyup.enter="Reg"></v-text-field>

            <div class="text-subtitle-1 text-medium-emphasis " >用户名</div>

          <v-text-field v-model="username" density="compact" placeholder="填写用户名" :rules="usernameRules"
            prepend-inner-icon="mdi-account" variant="outlined" @keyup.enter="Reg"></v-text-field>

          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            密码

            <a class="text-caption text-decoration-none text-blue" href="#" rel="noopener noreferrer" target="_blank">
              忘记密码?</a>
          </div>

          <v-text-field v-model="password" :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'" density="compact" placeholder="填写密码" :rules="passwordRules"
            prepend-inner-icon="mdi-lock-outline" variant="outlined" @click:append-inner="visible = !visible"
            @keyup.enter="Reg"></v-text-field>
          <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between">
            公司ID
          </div>

          <v-text-field v-model="companyid" density="compact" placeholder="填写提供的公司ID" :rules="companyidRules"
            prepend-inner-icon="mdi-domain" variant="outlined" @click:append-inner="visible = !visible"
            @keyup.enter="Reg" class="mb-5"></v-text-field>



          <v-btn block class="mb-8 custom-btn" size="large" variant="tonal" color="primary" @click="Reg" :loading="loading">
            注册
          </v-btn>

          <v-card-text class="text-center "><router-link to="/login" class="link">
            <v-icon icon="mdi-chevron-left" color="blue"></v-icon>
              <a class="text-blue text-center text-decoration-none mr-13" href="#" rel="noopener noreferrer" target="_blank">
                已有账号？返回登录
                
              </a></router-link>
          </v-card-text>
        </v-form>
      </v-card>
      <v-snackbar v-model="store.snackbar.show" :color="store.snackbar.color" :timeout="5000" top>
        {{ store.snackbar.message }}
        <template v-if="store.snackbar.showClose">
        </template>
      </v-snackbar>
    </div>
  </div>
</template>

<script>
import '../assets/loginstyle.css'

  export default {
    data: () => ({
      
      
      visible: false,
      usernameRules:[
      v => !!v || "不能为空",
      ],
      emailRules: [
      v => !!v || "不能为空",
      v => /.+@.+\..+/.test(v) || "E-mail必须合法填写",
      ],
      passwordRules: [
      value => !!value || '不能为空！',
      v => v.length >= 8 || '最少8个字节',
      v => /(?=.*\d)/.test(v) || '最少包含一个数字',
      v => /(?=.*[A-Z])/.test(v) ||'最少包含一个大写字母',

      ],
      companyidRules:[
      v => !!v || "不能为空",
      ],
    }),
  }
</script>
<style>
.container {
  display: flex;
  justify-content: flex-end;

  margin-right: 150px;

  /* 将子元素放置在容器的末尾（右侧） */
}
.custom-btn {
  font-weight: 700;
  color: var(--white-color);
  background-color: var(--primary-color);
  box-shadow: rgb(1, 255, 217) 0 20px 30px -10px;
  cursor: pointer;
  transition: box-shadow .3s;
}

.custom-btn:hover {
  box-shadow: rgb(1, 250, 184) 0 10px 30px -10px;
}

.link {
  text-decoration: none;
  width: 352px;
  display: inline-block;
}

  
</style>