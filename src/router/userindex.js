export default [
    {
      path: "/index/shipsearch",
      component: () => import("@/views/shipsearch.vue"),
      meta: {
        category: "我的",
        title: "运价和船期查询",
        layout: "ui",
        requiresUser:true,
      },
    },
    {
      path: "/index/quotation",
      component: () => import("@/views/quotationPage.vue"),
      meta: {
        category: "我的",
        title: "报价单查询",
        layout: "ui",
        requiresUser:true,
      },
    },
    {
      path: "/index/inquiry",
      component: () => import("@/views/inquiryPage.vue"),
      meta: {
        category: "我的",
        title: "询盘",
        layout: "ui",
        requiresUser:true,
      },
    },
    {
      path: "/index/subscribe",
      component: () => import("@/views/subscribePage.vue"),
      meta: {
        category: "我的",
        title: "订阅",
        layout: "ui",
        requiresUser:true,
      },
    },
    {
      path: "/index/profile",
      component: () => import("@/views/profile.vue"),
      meta: {
        category: "我的",
        title: "个人信息",
        layout: "ui",
        requiresUser:true,
      },
    },
    {
      path: "/index/arrival",
      component: () => import("@/views/pickarrival.vue"),
      meta: {
        category: "我的",
        title: "提交货单",
        layout: "ui",
        requiresUser:true,
      },
    },
    {
      path: "/index/file",
      component: () => import("@/views/userfile.vue"),
      meta: {
        category: "我的",
        title: "管理文档",
        layout: "ui",
        requiresUser:true,
      },
    },
   
];