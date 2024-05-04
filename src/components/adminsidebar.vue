<script setup>
import { useCustomizeThemeStore } from "@/stores/Theme.js";
import logo from "@/assets/admin-logo.png";
const storedUser = JSON.parse(localStorage.getItem('admin'));
const customizeTheme = useCustomizeThemeStore();
const navigationRail = (e) => {
    if (!customizeTheme.adminSidebar.railexpanded) return;
    customizeTheme.adminSidebar.isMini = e;
};

</script>
<template>
    <v-navigation-drawer expand-on-hover rail-width="77" :rail="customizeTheme.adminSidebar.railexpanded" class="my-4 layout_navigation bg-cyan-lighten-2 elevation-4"
        style="position: fixed" @update:rail="navigationRail">
        <v-list class="py-4 mx-2 logo" nav>
            <v-list-item class="mx-1"
                prepend-avatar="logo">
                <v-list-item-title class="title"><strong class="mr-2">海运</strong>万事通</v-list-item-title>

                <v-list-item-subtitle>专业海运物流管理</v-list-item-subtitle>
            </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list density="compact" nav class="mx-2" v-if="storedUser.usertype=='1'">
            <v-list-item class="mx-1" prepend-icon="mdi-list-box" title="运价和船期管理" value="price" to="/adminship"></v-list-item>
            <v-list-item class="mx-1" prepend-icon="mdi-domain" title="公司管理" value="shared" to="/admincompany"></v-list-item>
            <v-list-item class="mx-1" prepend-icon="mdi-tooltip-check" title="报价回复" value="quotation" to="/adminquo"></v-list-item>
            <v-list-item class="mx-1" prepend-icon="mdi-page-previous" title="询盘处理" value="getinquiry" to="/admininq"></v-list-item>
            
            
        </v-list>

        <v-list density="compact" nav class="mx-2" v-if="storedUser.usertype=='2'">
            <v-list-item class="mx-1" prepend-icon="mdi-home-silo" title="入库管理" value="getpackage" to="/wmsmanage"></v-list-item>
            <v-list-item class="mx-1" prepend-icon="mdi-package" title="出库管理" value="sendpackage" to="/sendcargo"></v-list-item>
            <v-list-item class="mx-1" prepend-icon="mdi-cube-send" title="预装箱确认" value="getting" to="/adminpacking"></v-list-item>
            <v-list-item class="mx-1" prepend-icon="mdi-map-marker-check" title="目的港签收确认" value="arrive" to="/signforlist"></v-list-item>
            <v-list-item class="mx-1" prepend-icon="mdi-file-cog" title="文档管理" value="file" to="/filemanage"></v-list-item>
            
        </v-list>
        
    </v-navigation-drawer>
</template>
<script>

</script>
<style lang="scss" scoped>
.layout_navigation {
    border-radius: 12px;
    margin: 16px 0 16px 16px !important;
    overflow: hidden;
    height: calc(100vh - 2rem) !important;

    .v-list-item__prepend>.v-icon,
    .v-list-item__append>.v-icon {
        opacity: 1 !important;
    }

    .v-list-item__prepend {
        width: 40px;
    }

    .v-list-item-title {
        font-size: 14px;
        font-weight: 500;
        // color: #ffffff;
        opacity: 1;

        .link {
            color: inherit;
        }
    }

    .v-list-group__items {
        .v-list-item {
            padding-inline-start: 47px !important;
        }

        .v-list-item--active {
            // background-color: rgb(var(--v-theme-primary));
        }
    }

    .v-icon {
        font-size: 24px !important;
    }

    .logo {
        .v-avatar {
            border-radius: 0;
        }

        .v-list-item__content {

            // margin-left: 30px;
            .title {
                margin-top: 4px;
                // font-size: 16px;
                // font-weight: 700;
            }

            .v-list-item-subtitle {
                margin-top: 4px;
            }
        }

        .v-list-item__prepend {
            width: auto;
            padding-left: 0;
        }
    }
}</style>