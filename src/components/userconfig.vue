<script setup >
import { useCustomizeThemeStore } from "@/stores/Theme.js";
import { Icon } from "@iconify/vue";
import { onMounted, ref, watch } from "vue";

const customizeTheme = useCustomizeThemeStore();


</script>
<template>
    <v-navigation-drawer location="right" temporary width="300" v-model="customizeTheme.userconfig">



        <div class="pa-5">
            <div class="top-area">
                <div class="d-flex align-center">
                    <b>UI 设置</b>
                    <v-spacer></v-spacer>
                </div>
                <div>在这里对你的UI进行设置.</div>
            </div>

            <hr class="my-6" />

            <div class="theme-area">
                <b>全局风格</b>
                <div class="px-3 pt-3" v-if="customizeTheme.darkTheme">
                    <v-btn icon color="grey-darken-4" class="text-white"
                        @click="customizeTheme.darkTheme = !customizeTheme.darkTheme">
                        <Icon width="30" icon="line-md:moon-filled-loop" />
                    </v-btn>
                    <span class="ml-5">Dark Mode</span>
                </div>
                <div class="px-3 pt-3" v-else>
                    <v-btn icon color="white" class="text-red"
                        @click="customizeTheme.darkTheme = !customizeTheme.darkTheme">
                        <Icon width="30" icon="line-md:moon-filled-alt-to-sunny-filled-loop-transition" />
                    </v-btn>
                    <span class="ml-5">Light Mode</span>
                </div>
            </div>
            <hr class="my-6" />

            
            <hr class="my-6" />

            <div>
                <v-btn color="" class="gradient info" block size="large">来我的米奇妙妙屋</v-btn>
            </div>
            <div class="ml-5 mt-5 d-flex align-center">

            </div>
            <div class="ml-3  d-flex align-center">
                <img src="@/assets/toby.jpg" alt="" class="rounded-lg" />
            </div>
        </div>
    </v-navigation-drawer>
</template>
  