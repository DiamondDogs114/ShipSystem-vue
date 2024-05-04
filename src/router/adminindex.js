export default [
    {
      path: "/adminindex",
      component: () => import("@/views/adminindex.vue"),
      meta: {
        requiresAdmin: true,
        category: "首页",
        title: '',
        layout: "adminui",
        
      },
    },
    {
      path: "/adminquo",
      component: () => import("@/views/adminquo.vue"),
      meta: {
        requiresAdmin: true,
        category: "报价",
        title: "报价回复",
        layout: "adminui",
        
      },
    },
    {
      path: "/admininq",
      component: () => import("@/views/admininq.vue"),
      meta: {
        requiresAdmin: true,
        category: "询价",
        title: "询盘处理",
        layout: "adminui",
        
      },
    },
    {
      path: "/adminship",
      component: () => import("@/views/adminshipconfig.vue"),
      meta: {
        requiresAdmin: true,
        category: "运价和船期",
        title: "运价和船期更新",
        layout: "adminui",
        
      },
    },
    {
      path: "/admincompany",
      component: () => import("@/views/admincompanyinfo.vue"),
      meta: {
        requiresAdmin: true,
        category: "公司管理",
        title: "公司管理",
        layout: "adminui",
        
      },
    },
    {
      path: "/sendcargo",
      component: () => import("@/views/sendcargo.vue"),
      meta: {
        requiresAdmin: true,
        category: "出库管理",
        title: "出库管理",
        layout: "adminui",
        
      },
    },
    {
      path: "/adminpacking",
      component: () => import("@/views/packinglist.vue"),
      meta: {
        requiresAdmin: true,
        category: "预装箱确认",
        title: "预装箱确认",
        layout: "adminui",
        
      },
    },
    {
      path: "/signforlist",
      component: () => import("@/views/signforlist.vue"),
      meta: {
        requiresAdmin: true,
        category: "目的港签收确认",
        title: "目的港签收确认",
        layout: "adminui",
        
      },
    },
    {
      path: "/wmsmanage",
      component: () => import("@/views/wmsconfig.vue"),
      meta: {
        requiresAdmin: true,
        category: "入库管理",
        title: "入库管理",
        layout: "adminui",
        
      },
    },
    {
      path: "/filemanage",
      component: () => import("@/views/adminfile.vue"),
      meta: {
        requiresAdmin: true,
        category: "文档管理",
        title: "文档管理",
        layout: "adminui",
        
      },
    },
]