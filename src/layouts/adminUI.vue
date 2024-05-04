<script setup>
import { useCustomizeThemeStore } from "@/stores/Theme.js";
import { useRouter } from 'vue-router';
import adminSidebar from '../components/adminsidebar.vue';
import salernotificate from "../components/salernotificate.vue";
import Breadcrumbs from '../components/adminbreadcrumb.vue';
import useAdminSocketStore from '../stores/adminnotification'
const store = useAdminSocketStore();
const customizeTheme = useCustomizeThemeStore();
const router=useRouter();
const storedUser = JSON.parse(localStorage.getItem('admin'));
const changeRail = () => {
    customizeTheme.adminSidebar.railexpanded = !customizeTheme.adminSidebar.railexpanded;
    customizeTheme.adminSidebar.isMini = customizeTheme.adminSidebar.railexpanded;
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


</script>

<template>
    <v-layout
    :class="{
            isMini: customizeTheme.adminSidebar.isMini,
        }">
        <adminSidebar />

        <main class="app_main">

            <header class="header elevation-2">
                <Breadcrumbs />
                <div class="mt-3 ml-9 gamepad"
                    @click="changeRail">
                    <v-icon v-if="customizeTheme.adminSidebar.railexpanded" icon="mdi-sort-variant-lock-open" />
                    <v-icon v-else icon="mdi-sort-variant" />
                </div>
                <div class=" ml-4 mr-1"></div>

                <v-spacer></v-spacer>
                <h3>{{storedUser.adminrealname}}的工作台</h3>
                <v-spacer></v-spacer>

                <div class="tool_btns ">
                    <!-- <v-btn
                        @click="mainStore.onTheme"
                        variant="text"
                        :icon="
                            mainStore.theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
                        "
                    /> -->
                    
                    <salernotificate></salernotificate>

                    <v-btn variant="text" append-icon="mdi-chevron-down" class="mr-2">
                        <v-avatar size="x-small" class="avatar mr-2">
                            <img width="24"
                                src="../assets/toby.jpg" alt="alt" />
                        </v-avatar>
                        <span>{{storedUser.adminrealname}}</span>
                        <v-menu activator="parent">
                            <v-list nav class="h_a_menu">

                               
                                <v-list-item title="登出" prepend-icon="mdi-login" @click="logout" />
                            </v-list>
                        </v-menu>
                    </v-btn>
                </div>
                <div style="position: fixed; right: 20px; bottom: 100px; z-index: 99999">
                    <v-btn icon="mdi-cog" />
                </div>
            </header>
            <div>
            <slot>
                

            </slot>
        </div>

        </main>
    </v-layout>
</template>
<script >
export default {
  

};

</script>
<style style="scss">
.app_main {
    flex: 1;
    margin-left: 288px;
    padding-right: 16px;
    transition: all 0.2s;
    margin-top: 92px;

    .header {

        background: rgba(var(--header-bg), 0.8);

        backdrop-filter: saturate(200%) blur(30px);

        height: 76px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        border-radius: 10px;
        position: fixed;
        top: 16px;
        left: 288px;
        width: calc(100vw - 312px);
        z-index: 2;

        .header_title {
            .v-breadcrumbs {
                padding: 0 !important;

                

                .v-breadcrumbs-item--disabled {
                    opacity: 0.6;
                }

                .v-breadcrumbs-item {
                    font-weight: 500;
                }

                .v-breadcrumbs-divider {

                    opacity: 0.6;
                    padding: 0;
                }

                .v-breadcrumbs__prepend {
                    opacity: 0.6;

                    .v-icon {
                        margin-left: 5px;

                    }


                }

                .link {
                    color: inherit;
                }
            }

            .page_title {
                margin-top: 8px;
                font-size: 16px;
                font-weight: 700;
            }
        }

        .gamepad {
            cursor: pointer;
            align-self: flex-start;
            position: relative;
            z-index: 2;
        }

        .search_ip {
            position: relative;
            z-index: 2;

            .v-field--variant-solo {
                box-shadow: none;
            }
        }

        .tool_btns {
            position: relative;
            z-index: 2;
        }
    }

    .router {
        padding-top: 16px;
    }
}
.isMini {
    .layout_navigation {
        .v-list-item__prepend {
            padding-left: 0;
        }
        .v-list-group__items {
            .v-list-item {
                padding-inline-start: 8px !important;
            }
        }

    }
    .app_main {
        margin-left: 108px;
        .header {
            left: 108px;
            width: calc(100vw - 132px);
        }
    }
}
</style>