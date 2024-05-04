<script setup>
import UILayout from "@/layouts/UIlayout.vue";
import DefaultLayout from "@/layouts/defaultlayout.vue";
import theIndexUI from "./layouts/theIndexUI.vue";
import adminUI from "./layouts/adminUI.vue";
import { useCustomizeThemeStore } from "@/stores/theme.js";
import BackToTop from "@/components/backtotop.vue";
import { useRoute } from "vue-router";
import { computed } from 'vue';



const customizeTheme = useCustomizeThemeStore();
const route = useRoute();

const isRouterLoaded = computed(() => {
  if (route.name !== null) return true;
  return false;
});

const layouts = {
  default: DefaultLayout,
  ui: UILayout,
  index:theIndexUI,
  adminui:adminUI
  
};

const currentLayout = computed(() => {
  const layoutName = route.meta.layout;
  if (!layoutName) {
    return DefaultLayout;
  }
  // 确保 layoutName 在有效的类型中
  if (["default", "ui" , "index","adminui"].includes(layoutName)) {
    return layouts[layoutName];
  } else {
    // 处理未知的 layoutName，这里可以根据实际情况进行处理
    console.error(`Unknown layoutName: ${layoutName}`);
    return DefaultLayout;
  }
});

</script>  

<template>
  <v-app :theme="customizeTheme.darkTheme ? 'dark' : 'light'">
    <component :is="currentLayout" v-if="isRouterLoaded">
      <router-view> </router-view>
    </component>
    
    <BackToTop />

  </v-app>
</template>

