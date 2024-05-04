<script setup>
import useAdminSocketStore from '../stores/adminnotification'
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router';

const router = useRouter();
const store = useAdminSocketStore();



onMounted(() => {
    store.connectSocket();
});


const clearAllNotifications = () => {
    // 清空通知数组
    store.messages = [];
    // 将通知数量设为 0
    store.notificationCount = 0;

};

const handleNotificationClick = (message) => {
    // 在点击通知时执行跳转
    if (message.link) {
        router.push(message.link);
    }

    // 从通知数组中移除该通知
    const index = store.messages.indexOf(message);
    if (index !== -1) {
        store.messages.splice(index, 1);
        store.notificationCount -= 1;
    }
};


</script>
<template>
    <v-menu location="bottom right" transition="slide-y-transition">
        <!-- ---------------------------------------------- -->
        <!-- Activator Btn -->
        <!-- ---------------------------------------------- -->
        <template v-slot:activator="{ props }">
            <v-btn icon v-bind="props" class="text-none" flat variant="text">

                <v-badge v-if="store.notificationCount > 0" :content="store.notificationCount" color="error">
                    <v-icon>mdi-bell-outline</v-icon>
                </v-badge>
                <v-icon v-if="store.notificationCount === 0">mdi-bell-outline</v-icon>
            </v-btn>
        </template>
        <v-list elevation="1" density="compact" max-width="400" v-if="store.messages && store.messages.length > 0">
            <v-list-subheader>通知</v-list-subheader>
            <v-list-item v-for="(message, i) in store.messages" :key="i" @click="handleNotificationClick(message)">
                <template v-slot:prepend>             
                        <v-icon color="green">{{ message.icon }}</v-icon>                  
                </template>
                <div>
                    <v-list-item-subtitle>{{
                        message.title
                    }}</v-list-item-subtitle>                  
                </div>
            </v-list-item>
            <div class="text-center py-5">
                <v-btn size="small" variant="elevated" elevation="1" @click="clearAllNotifications"> 确认 </v-btn>
            </div>
        </v-list>
        <v-list elevation="1" density="compact" max-width="400" v-else>
            <v-list-subheader>通知</v-list-subheader>
            <v-list-item>
                <template v-slot:prepend>
                    <v-icon color="grey">mdi-alert</v-icon>
                </template>
                <v-list-item-title v-text="'暂无通知'"></v-list-item-title>
            </v-list-item>
        </v-list>
    </v-menu>
</template>