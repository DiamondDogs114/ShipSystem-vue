<script setup>
import { ref, onMounted, watch } from 'vue'
import request from '../utils/request.js';
import useChatSocketStore from '../stores/chat.js'

const storedUser = JSON.parse(localStorage.getItem('user'));
const store = useChatSocketStore();
const dialog = ref(false);
const userMessage = ref("");
const chatmessage = ref([]);
const connectedAdminId = ref(0);
const isConnectedToAdmin = ref(false);
const buttonDisabled = ref(false);
const connecteduserid = ref();

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
            role: "user",
        };
        chatmessage.value.push(newMessage);
        store.socket.emit('sendmessage', { userid: storedUser.userid, adminid: connectedAdminId.value, content: userMessage.value });
        userMessage.value = "";

    }
};
onMounted(() => {
    store.connectSocket('user');
    store.socket.on('messageFromAdmin', (data) => {

        const adminmessage = {
            content: data.content,
            role: "admin",
        };
        chatmessage.value.push(adminmessage);
        console.log(content);

    });

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


const opendialog = () => {
    dialog.value = true;
    buttonDisabled.value = true;
    store.socket.emit('checkAdminOnline', { userid: storedUser.userid });
    if (!isConnectedToAdmin.value) {
        store.socket.emit('checkAdminOnline', { userid: storedUser.userid });
        store.socket.emit('getOnlineAdminid', { userid: storedUser.userid })
        connectedAdminId.value = store.connectedAdminId;
        connecteduserid.value = store.connecteduserid;
        console.log("onlineadminid:", connectedAdminId)
        console.log("onlineuserid:", connecteduserid)
        isConnectedToAdmin.value = true;

    }

};
const closedialog = () => {
    dialog.value = false;
    buttonDisabled.value = false;


}


</script>
<template >
    <v-btn @click="opendialog" icon :disabled="buttonDisabled">
        <v-icon>mdi-chat-outline </v-icon>
        <v-tooltip activator="parent" location="bottom" text="客服"></v-tooltip>
    </v-btn>
    <teleport to="body">
        <v-slide-y-transition>
            <v-card v-if="dialog" class="dialog-bottom d-flex flex-column" width="600px" height="500px">
                <v-card-title>
                    <v-btn icon size="small" @click.stop="closedialog" color="red">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                    <span class="flex-fill ml-3">
                        <v-avatar size="40">
                            <img width="40" height="40" class="" src="https://img.icons8.com/color/96/null/filled-chat.png"
                                alt="alt" />
                        </v-avatar>

                        客服咨询
                    </span>
                </v-card-title>
                <v-divider />
                <v-card-text class="overflow-scroll">

                    <p class="text-center">{{ store.chats }}</p>

                    <p v-if="isConnectedToAdmin" class="text-center text-green">已经为您匹配工号为{{ connectedAdminId }}的客服</p>
                    <perfect-scrollbar v-if="chatmessage.length > 0" class="message-container">
                        <template v-for="messages in chatmessage">
                            <div v-if="messages.role === 'user'">
                                <div class="pa-2 user-message">
                                    <v-avatar class="ml-2" rounded="sm" variant="elevated">
                                        <img width="40"
                                            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwrAiMevuwrbU9o0Ck2paVf4ufHUDb2dU48MEDrAlrQw&s"
                                            alt="alt" />
                                    </v-avatar>
                                    <v-card class="gradient gray text-pre-wrap" theme="dark">
                                        <v-card-text>
                                            <b> {{ messages.content }}</b></v-card-text>
                                    </v-card>
                                </div>
                            </div>
                            <div v-else>
                                <div class="pa-2 assistant-message">
                                    <v-avatar class=" mr-2" rounded="sm" variant="elevated">
                                        <img width="40" src="@/assets/toby.jpg" alt="alt" />
                                    </v-avatar>
                                    <v-card>
                                        <div>
                                            <v-card-text>
                                                <b> {{ messages.content }}</b></v-card-text>
                                        </div>
                                    </v-card>
                                </div>
                            </div>
                        </template>
                    </perfect-scrollbar>
                </v-card-text>
                <v-divider />

                <v-sheet color="transparent" elevation="0" class="d-flex align-end justify-center pa-2">

                    <v-text-field class="mx-2" color="primary" type="text" clearable variant="solo" ref="input" hide-details
                        density="compact" flat placeholder="输入消息" rounded="pill" v-model="userMessage"
                        @keydown="handleKeydown">
                    </v-text-field>

                    <v-btn class="d-flex mx-auto" color="cyan-lighten-3" variant="text" size="small" @click="sendMessage"
                        icon>
                        <v-icon>mdi-send</v-icon>
                    </v-btn>
                </v-sheet>
            </v-card>
        </v-slide-y-transition>
    </teleport>
</template>
<script>
export default {

}
</script>
<style scoped lang="scss">
.dialog-bottom {
    z-index: 999;
    position: fixed;
    bottom: 10px;
    right: 0px;
}

.chat-bot {
    background-repeat: repeat;
    height: 100%;
    display: flex;
    flex-direction: column;
    position: relative;

    .messsage-area {
        flex: 1;
        height: 100%;
    }

    .input-area {
        position: absolute;
        width: 100%;
        bottom: 0;
        padding: 1rem;
        align-items: center;
    }
}

.user-message {
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

.message {
    margin: 0 auto;
    max-width: 1200px;
    display: flex;
}

.message-container {
    height: 310px;

    background-repeat: repeat;
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

:deep(.md-editor-preview-wrapper) {
    padding: 5px 15px;
}

.font-1 {
    font-size: 13px !important;
}

:deep(#md-editor-v3-preview),
.user-message {
    font-size: 14px !important;
}
</style>