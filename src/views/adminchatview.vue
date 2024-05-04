<script setup>
import { ref, onMounted,watch } from 'vue';
import { useRouter } from 'vue-router';
import { Vue3Lottie } from 'vue3-lottie'

import useChatSocketStore from '../stores/chat.js'
import dataJson from '../assets/chat.json'
const storedUser = JSON.parse(localStorage.getItem('admin'));
const store = useChatSocketStore();
const router = useRouter();
const chatnavbar = ref(true);
const othernavbar = ref(true);
const infonavbar = ref(false);
const userMessage = ref("");
const chatmessage = ref([]);
const connecteduserid = store.connecteduserid;
const userinfos = ref([]);
const infousername=ref();
const inforealname=ref();
const infophone=ref();
const infoemail=ref();


onMounted(() => {
    store.connectSocket('admin');
    store.socket.on('receiveMessage', (data) => {

        const usermessage = {
            content: data.content,
            role: "user",
        };
        chatmessage.value.push(usermessage);

    });
    store.socket.on('onlineUserDetails', (data) => {
        const userinfo = data.onlineUsers;
        userinfos.value.unshift(userinfo);
        console.log('userinfo:', userinfos)

    })
    

});
watch(
    () => chatmessage.value,
     (val) => {
    if (val) {
      scrollToBottom(document.querySelector('.message-container'));
    }
  }, { deep: true });

const scrollToBottom = (element, options = { behavior: "auto" }) => {
  // 使用可选链操作符（optional chaining）确保 element 不为 null
  element?.scrollTo({
    // 将传入的 options 对象展开，并覆盖 top 属性为元素的 scrollHeight
    ...options,
    top: element.scrollHeight,
  });
};


const logout = () => {
    // 清除 localStorage 中的 token
    localStorage.removeItem('admintoken');
    // 其他清除操作，例如清除用户信息等
    localStorage.removeItem('admin');
    // 断开与后端 Socket.IO 的连接
    store.disconnectSocket();
    // 跳转到登录页面或其他需要跳转的页面
    router.push('/adminlogin');
};

const handleKeydown = (e) => {
    if (e.key === "Enter" && (e.altKey || e.shiftKey)) {
        // 当同时按下 alt 或者 shift 和 enter 时，插入一个换行符
        e.preventDefault();
        userMessage.value += "\n";
    } else if (e.key === "Enter") {
        // 当只按下 enter 时，发送消息
        e.preventDefault();
        sendMessage();
    }
};

const sendMessage = () => {
    if (userMessage.value) {
        // 将消息添加到列表
        const newMessage = {
            content: userMessage.value,
            role: "admin",
        };
        chatmessage.value.push(newMessage);
        store.socket.emit('sendMessage', { userid: connecteduserid, adminid: storedUser.adminid, content: userMessage.value });
        // 清空输入
        userMessage.value = '';

        console.log("onlineadminid:", connecteduserid)


    }
};
const openinfo = (user) => {
    infousername.value=user.username;
    inforealname.value=user.realname;
    infophone.value = user.phone;
    infoemail.value=user.email;
    
    infonavbar.value=true;

}


</script>
<template>
    <v-app id="inspire">


        <v-navigation-drawer color="cyan-lighten-3" rail v-model="chatnavbar">
            <v-btn class="d-block text-center mx-auto mt-4" size="36" icon>
                <v-badge content="2" color="success" dot bordered>
                    <v-avatar>
                        <img width="40" src="@/assets/toby.jpg" alt="alt" />
                    </v-avatar>
                </v-badge>
            </v-btn>

            <v-divider class="mx-3 my-5"></v-divider>
            <v-tooltip text="显示用户" location="left">
                <template v-slot:activator="{ props }">
                    <v-btn class="d-block text-center mx-auto mb-5" v-bind="props" @click="othernavbar = !othernavbar"
                        rounded="xl" color="white" size="28">
                        <v-icon>mdi-format-list-bulleted</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>
            <v-tooltip text="登出" location="left">
                <template v-slot:activator="{ props }">
                    <v-btn class="d-block text-center mx-auto mb-5" v-bind="props" rounded="xl" color="white" size="28"
                        @click="logout">
                        <v-icon>mdi-logout</v-icon>
                    </v-btn>
                </template>
            </v-tooltip>

        </v-navigation-drawer>

        <v-navigation-drawer width="280" v-model="othernavbar" class="chatbar">
            <v-card class="info_bg d-block mx-auto" height="170" width="100%" flat>
                <v-avatar class="d-block  text-center mx-auto mt-4" color="grey-darken-1" size="50">
                    <img width="50" src="@/assets/toby.jpg" alt="alt" />
                </v-avatar>
                <p class="text-center mt-3 text-h6">欢迎回来，{{ storedUser.adminrealname }}</p>

                <p class="text-center mt-2 text-grey ">{{ storedUser.aemail }}</p>
            </v-card>
            <v-divider class="mx-3 my-5"></v-divider>
            <v-responsive max-width="170" class="d-flex mx-auto">
                <v-text-field bg-color="grey-lighten-1" density="compact" flat rounded="pill" variant="solo-filled"
                    placeholder="查找用户" prepend-inner-icon="mdi-magnify"></v-text-field>
            </v-responsive>
            <h3 class="text-center">在线用户</h3>
            <v-list>
                <li v-for="(userinfo, index) in store.userinfos" :key="index">
                    <v-list-item v-for="user in userinfo" :key="user.userid">
                        <template v-slot:prepend>
                            <v-avatar color="blue" class="ml-2" rounded="sm" variant="elevated">
                                <img width="40"
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwrAiMevuwrbU9o0Ck2paVf4ufHUDb2dU48MEDrAlrQw&s"
                                    alt="alt" />
                            </v-avatar>
                        </template>
                        <div>
                            <v-list-item-title class="font-weight-bold text-primary">{{ user.username }}</v-list-item-title>
                            <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
                        </div>
                        <template v-slot:append>
                            <v-btn color="grey-lighten-1" icon="mdi-information" variant="text"
                                @click="openinfo(user)"></v-btn>
                        </template>
                    </v-list-item>
                </li>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar class="px-3 ml-2 toolbar" color="grey-lighten-4" flat height="72">
            <v-app-bar-nav-icon @click="chatnavbar = !chatnavbar"></v-app-bar-nav-icon>
            <v-spacer></v-spacer>
            <v-list-item slim>
                <v-list-item-title class="text-h6">
                    <strong class="font-weight-black">海运</strong>
                    万事通
                </v-list-item-title>
                <v-list-item-subtitle class="mt-2 text-grey">
                    您的专业海运管家
                </v-list-item-subtitle>
            </v-list-item>
        </v-app-bar>

        <v-main class="ml-2">
            <perfect-scrollbar v-if="chatmessage.length > 0" class="message-container">
            <template v-for="messages in chatmessage" >
                <div v-if="messages.role === 'admin'">
                    <div class="pa-2 admin-message">
                        <v-avatar class="ml-2" rounded="sm" variant="elevated">
                            <img width="40" src="@/assets/toby.jpg" alt="alt" />
                        </v-avatar>
                        <v-card class="gradient gray text-pre-wrap" color="cyan-lighten-3">
                            <v-card-text>
                                <b> {{ messages.content }}</b></v-card-text>
                        </v-card>
                    </div>
                </div>
                <div v-else>
                    <div class="pa-2 assistant-message">
                        <v-avatar class=" mr-2 ml-5" rounded="sm" variant="elevated">
                            <img width="40"
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwrAiMevuwrbU9o0Ck2paVf4ufHUDb2dU48MEDrAlrQw&s"
                                alt="alt" />
                        </v-avatar>
                        <v-card class="gradient gray text-pre-wrap">
                            <v-card-text>
                                <b> {{ messages.content }}</b></v-card-text>
                        </v-card>
                    </div>
                </div>
            </template>
        </perfect-scrollbar>
            <div class="no-message-container" v-else>
                <h1 class="text-h4 text-md-h2 text-blue-lighten-1 font-weight-bold">
                    开始聊天
                </h1>
                <div class="lottieBox">
                    <Vue3Lottie :animationData="dataJson" />
                </div>
            </div>

        </v-main>

        <v-navigation-drawer location="right" v-model="infonavbar" :width="280">
            <v-btn class="d-flex ml-2" color="red" variant="text" size="small" icon @click="infonavbar = !infonavbar">
                <v-icon>mdi-close</v-icon>
            </v-btn>

            <div class="d-flex flex-column pa-10">
                <v-avatar size="80" class="mx-auto elevation-12" color="white">
                    <v-img
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwrAiMevuwrbU9o0Ck2paVf4ufHUDb2dU48MEDrAlrQw&s">
                    </v-img>
                </v-avatar>

                <div class="text-center mt-5">
                    <h3 class="text-h6 font-weight-bold">
                        {{ infousername }}

                    </h3>
                    <v-chip size="small" class="font-weight-bold" color="blue">
                        客户
                    </v-chip>
                    <p class="text-body-2">交易客户</p>
                </div>
            </div>
            <v-divider></v-divider>
            <div class="py-5 px-10">
                <v-icon color="grey"> mdi-account-circle </v-icon>
                <span class="ml-4">{{ inforealname }}</span>
            </div>

            <v-divider></v-divider>
            <div class="py-5 px-10">
                <v-icon color="grey"> mdi-email-check-outline </v-icon>
                <span class="ml-4">{{ infoemail }}</span>
            </div>
            <v-divider></v-divider>

            <div class="py-5 px-10">
                <v-icon color="grey"> mdi-phone-outline </v-icon>
                <span class="ml-4">{{ infophone }}</span>
            </div>

        </v-navigation-drawer>

        <v-footer app height="72" class="ml-3">
            <v-text-field bg-color="grey-lighten-2" class="overflow-hidden" density="compact" flat hide-details
                rounded="pill" variant="solo" placeholder="输入消息" v-model="userMessage"
                @keydown="handleKeydown"></v-text-field>
            <v-btn class="d-flex mx-auto" color="cyan-lighten-3" variant="text" size="small" icon @click="sendMessage">
                <v-icon>mdi-send</v-icon>
            </v-btn>
        </v-footer>
    </v-app>
</template>
<style lang="scss" scoped>
li {
    list-style-type: none;
}

.chatbar {
    border-radius: 12px;
    margin: 16px 0 16px 16px !important;
    overflow: hidden;
    height: calc(100vh - 2rem) !important;
}

.no-message-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    h1 {
        font-size: 2rem;
        font-weight: 500;
    }
}
.message-container {
  height: calc(100vh - 154px);
}

.admin-message {
    display: flex;
    align-content: center;
    justify-content: end;
    flex-direction: row-reverse;
}

.assistant-message {
    display: flex;
    align-content: center;
    justify-content: start;
    flex-direction: row;
}

.info_bg {
    background: linear-gradient(to top, #ffffff, #80DEEA);
}

.lottieBox {
    min-width: 300px;
    max-width: 300px;
}
</style>