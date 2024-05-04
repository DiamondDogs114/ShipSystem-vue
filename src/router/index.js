import { createRouter, createWebHistory } from 'vue-router'
import userindex from './userindex.js'
import useUserstore from '../stores/user.js';
import adminindex from './adminindex.js'
import Login from '../views/login.vue'
import AdminLogin from '../views/adminlogin.vue'
import index from '../views/index.vue'
import register from '../views/register.vue'
import mainindex from '../views/mainindex.vue'
import adminchatview from '../views/adminchatview.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: mainindex
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/adminlogin',
      name: 'adminlogin',
      component: AdminLogin
    },
    {
      path: '/index',
      name: 'index',
      meta: {
        title: "首页",
        layout: "index",
      },
      component: index
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('@/views/test.vue')
    },
    {
      path: '/test2',
      name: 'test2',
      component: () => import('@/views/test2.vue')
    },
    {
      path: '/reg',
      name: 'register',
      component: register
    },
    {
      path: '/chatforadmin',
      name: 'adminchat',
      component: adminchatview
    },
    ...userindex,
    ...adminindex,

  ]
})
router.beforeEach((to, from, next) => {
  const userStore = useUserstore();

  const tokenStr = window.localStorage.getItem('token');
  const adminStr = window.localStorage.getItem('admintoken')

  

  // 如果用户访问登录页面，直接放行
  if (to.path === '/' || to.path === '/index' || to.path === '/adminlogin' || to.path === '/reg' || to.path === '/websockettest'|| to.path === '/login') {
    next();
  }

  else {
    // 如果没有 token，则重定向到登录页面
    if (to.meta.requiresAdmin && !adminStr) {
      // 需要管理员权限但没有管理员 token
      userStore.showSnackbar('无管理员权限', 'error');
      next('/');
    } else if (to.meta.requiresUser && !tokenStr) {
      // 需要客户权限但没有客户 token
      userStore.showSnackbar('请登录', 'error');
      next('/');
    } else if (!to.meta.requiresAdmin && !to.meta.requiresUser) {
      // 不需要任何权限，放行
      next();
    } else if (to.matched.some(record => record.path === '/adminindex')) {
      const storedAdmin = JSON.parse(localStorage.getItem('admin'));
      if (storedAdmin) {
        to.meta.title = `欢迎回来，${storedAdmin.adminrealname}`;
      }
      next();
    } else {
      next();
    }

  }
});


export default router
