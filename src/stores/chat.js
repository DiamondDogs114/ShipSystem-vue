import { defineStore } from 'pinia';
import io from 'socket.io-client';
import { ref} from 'vue';

export const useChatSocketStore = defineStore({
  id: 'socket',
  state: () => ({
    socket: null,
    userinfos: [],
    messages: [],
    notificationCount: 0,
    type: '',
    chats: '',
    connectedAdminId: 0,
    connecteduserid: 0,
    getcontent:null,
  }),
  actions: {
    connectSocket(type) {
      if (type === 'admin') {
        this.socket = io('http://localhost:9092', {
          query: {
            adminid: JSON.parse(localStorage.getItem('admin')).adminid,
          },
          debug: true,
        });
        this.socket.on('connect', () => {
          console.log('管理员WebSocket连接成功');
        });
        this.socket.emit('getOnlineUserIds');
        this.socket.on('onlineUserDetails', this.handleuserinfo);
        this.socket.on('receiveMessage', this.handleusermessage);
      } else if (type === 'user') {
        this.socket = io('http://localhost:9092', {
          query: {
            userid: JSON.parse(localStorage.getItem('user')).userid,
          },
          debug: true,
        });
        this.socket.on('connect', () => {
          console.log('客户WebSocket连接成功');
        });
        this.socket.on('adminOnlineStatus', this.handleadminonline);
        this.socket.on('onlineAdminid', this.handleonlineadminid);
        this.socket.on('messageFromAdmin',this.handleadminmessage);
        this.socket.on('subscription-update',this.handleNotification);
      this.socket.on('inquiry-update',this.handleinquiry);
   
      }
    },


    disconnectSocket() {
      if (this.socket) {
        this.socket.disconnect();
      }
      this.socket.on('disconnect', () => {
        console.log('WebSocket连接关闭成功');
      });

    },
    handleuserinfo(data) {
     const userinfo=data.onlineUsers;
        
      this.userinfos.unshift(userinfo);
      console.log('userinfo:', this.userinfos);
    },
    handleadminonline(message) {
      this.chats = message;
      console.log('Received notification:', message);
    },
    handleonlineadminid(data) {
      const randomAdminid = data.adminid;
      const receiveuserid = data.userid;
      this.connectedAdminId = randomAdminid;
      this.connecteduserid = receiveuserid;
      
       console.log('adminid:', data);
      console.log('adminid:', this.connectedAdminId);
      console.log('adminid:', this.connecteduserid);
     


    },
    handleusermessage(data){
      const content=data.content;
      const getuserid=data.userid;
      this.connecteduserid=getuserid;
      this.getcontent=content;
      console.log('adminid:', this.getcontent);
      console.log('adminid:', this.connecteduserid);



    },
    handleadminmessage(data){
      const content=data.content;      
      this.getcontent=content;
      console.log('adminid:', this.getcontent);
    },
    handleNotification(notification) {
      const newMessage = {
        color: 'green',
        icon: 'mdi-alert-decagram',
        title: '订阅有更新!',
        subtitle: notification,
        link: '/index/subscribe',
      };
      this.notificationCount += 1;
      this.messages.unshift(newMessage);
      console.log('Received notification:', notification);
    },
    handleinquiry(notification) {
      const newMessage = {
        color: 'green',
        icon: 'mdi-message-check',
        title: '询盘有回复了！',
        subtitle: notification,
        link: '/index/inquiry',
      };
      this.notificationCount += 1;
      this.messages.unshift(newMessage);
      console.log('Received notification:', notification);
    },
    



  },
});

export default useChatSocketStore