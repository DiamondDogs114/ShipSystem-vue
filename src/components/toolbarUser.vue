<script setup >
import useChatSocketStore from '../stores/chat'
import { useRouter } from 'vue-router';
const storedUser = JSON.parse(localStorage.getItem('user'));
const store = useChatSocketStore();
const router=useRouter();

const logout = () => {
  // 清除 localStorage 中的 token
  localStorage.removeItem('token');
  // 其他清除操作，例如清除用户信息等
  localStorage.removeItem('user');
  // 断开与后端 Socket.IO 的连接
  store.disconnectSocket();
  // 跳转到登录页面或其他需要跳转的页面
  router.push('/login');
};
const navs = [
  {
    title: "个人信息",
    key: "menu.profileDetails",
    link: "/index/profile",
    icon: "mdi-account-box-outline",
  },
  {
    title: "关于我们",
    key: "menu.askCommunity",
    link: "/other",
    icon: "mdi-help-circle-outline",
  },
];
</script>

<template>
  <v-menu :close-on-content-click="false" location="bottom right" transition="slide-y-transition" v-if="storedUser">
    <!-- ---------------------------------------------- -->
    <!-- Activator Btn -->
    <!-- ---------------------------------------------- -->
    <template v-slot:activator="{ props }">
      <v-btn class="mx-2" icon v-bind="props">
        <v-badge content="2" color="success" dot bordered>
          <v-avatar size="40">
            <v-img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwrAiMevuwrbU9o0Ck2paVf4ufHUDb2dU48MEDrAlrQw&s"></v-img>
          </v-avatar>
        </v-badge>
      </v-btn>
    </template>
    <v-card max-width="300">
      <v-list lines="three" density="compact">
        <!-- ---------------------------------------------- -->
        <!-- Profile Area -->
        <!-- ---------------------------------------------- -->
        <v-list-item to="/index/profile">
          <template v-slot:prepend>
            <v-avatar size="40">
              <v-img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwrAiMevuwrbU9o0Ck2paVf4ufHUDb2dU48MEDrAlrQw&s"></v-img>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold text-primary">
            {{ storedUser.username }}
            <StatusMenu />
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ storedUser.email }}
          </v-list-item-subtitle>
        </v-list-item>
      </v-list>

      <v-divider />
      <!-- ---------------------------------------------- -->
      <!-- Menu Area -->
      <!-- ---------------------------------------------- -->

      <v-list variant="flat" elevation="0" :lines="false" density="compact">
        <v-list-item color="primary" v-for="(nav, i) in navs" :key="i" :to="nav.link" link density="compact">
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-icon>{{ nav.icon }}</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-subtitle class="text-body-2">
              {{ nav.title }}</v-list-item-subtitle>
          </div>
        </v-list-item>
      </v-list>
      <v-divider />
      <!-- ---------------------------------------------- -->
      <!-- Logout Area -->
      <!-- ---------------------------------------------- -->
      <v-list variant="flat" elevation="0" :lines="false" density="compact">

        <v-list-item color="primary" link density="compact" @click="logout">
          <template v-slot:prepend>
            <v-avatar size="30">
              <v-icon>mdi-logout</v-icon>
            </v-avatar>
          </template>

          <div>
            <v-list-item-subtitle class="text-body-2">
              登出
            </v-list-item-subtitle>
          </div>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
  <v-menu :close-on-content-click="false" location="bottom right" transition="slide-y-transition" v-else>
    <!-- ---------------------------------------------- -->
    <!-- no login -->
    <!-- ---------------------------------------------- -->
    <template v-slot:activator="{ props }">
      <v-btn class="mx-2" icon v-bind="props">
        <v-badge content="2" color="grey" dot bordered>
          <v-avatar size="40" color="info">
            <v-icon icon="mdi-account-circle"></v-icon>
          </v-avatar>
        </v-badge>
      </v-btn>
    </template>
    <v-card max-width="300">
      <v-list lines="three" density="compact">
        <!-- ---------------------------------------------- -->
        <!-- Profile Area -->
        <!-- ---------------------------------------------- -->
        <v-list-item to="/index/profile">
          <template v-slot:prepend>
            <v-avatar size="40" color="info">
              <v-icon icon="mdi-account-circle"></v-icon>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-bold text-primary ">
            登录

          </v-list-item-title>
          <v-list-item-subtitle>
            点击此处登录
          </v-list-item-subtitle>

        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>
<script>
export default {

};
</script>
