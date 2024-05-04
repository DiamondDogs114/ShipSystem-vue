import { defineStore } from 'pinia';
import io from 'socket.io-client';

export const useAdminSocketStore = defineStore({
  id: 'socket',
  state: () => ({
    socket: null,
    messages: [],
    notificationCount: 0,
  }),
  actions: {
    connectSocket() {
      this.socket = io('http://localhost:9092', {
        query: {
          adminid: JSON.parse(localStorage.getItem('admin')).adminid,
        },
        debug: true,
      });
      this.socket.on('connect', () => {
        console.log('管理员WebSocket连接成功');
      });
      this.socket.on('admininquiry-update',this.handleNotification);
      this.socket.on('adminarrival-update',this.handlearrivalNotification);
    },
    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
      }
      this.socket.on('disconnect', () => {
        console.log('WebSocket连接关闭成功');
      });

    },
    handleNotification(notification) {
      const newMessage = {
        color: 'green',
        icon: 'mdi-message-badge',
        title: notification,
        link: '/admininq',
      };
      this.notificationCount += 1;
      this.messages.unshift(newMessage);
      console.log('Received notification:', notification);
    },
    handlearrivalNotification(notification) {
        const newMessage = {
          color: 'green',
          icon: 'mdi-sticker-alert',
          title: notification,
          link: '/wmsmanage',
        };
        this.notificationCount += 1;
        this.messages.unshift(newMessage);
        console.log('Received notification:', notification);
      },
    

  },
});

export default useAdminSocketStore