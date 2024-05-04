<template>
    <div v-if="!$route.meta.hideNav" class="header_title ml-4">
        <div>
            <v-breadcrumbs :items="routes">
                <template v-slot:prepend>
                    <router-link to="/adminindex" class="link" style="width: 25px;"><v-icon size="small"
                            icon="mdi-home-circle"></v-icon></router-link>
                    <li class="v-breadcrumbs-divider">/</li>
                </template>
            </v-breadcrumbs>
        </div>
        <div class="page_title">{{ pageTitle }}</div>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, watch } from 'vue';
import { useRoute } from 'vue-router';

const $route = useRoute();
const routes = ref();
const pageTitle = computed(() => $route.meta.title);

function init() {
    const { matched } = $route;
    if (matched[0].path === '/adminindex') {
        routes.value = [
            {
                title: '首页',
                disabled: false,
                href: '/adminindex',
            },
        ];
        return;
    }
    if (matched.length >= 2 &&matched[0].path === matched[1].path) {
        routes.value = [
            {
                title: '首页',
                disabled: false,
                href: '/adminindex',
            },
            {
                title: matched[0].meta.title,
                disabled: true,
                href: matched[0].path,
            },
        ];
        return;
    }
    routes.value = [];
    matched.forEach((route, index) => {
        if (index === matched.length - 1) {
            routes.value.push({
                title: route.meta.title,
                exact: true,
                disabled: false,
                href: $route.path,
            });
        } else {
            routes.value.push({
                title: route.meta.title,
                exact: false,
                disabled: true,
                href: route.path,
            });
        }
    });
}
init();
watch($route, init);
</script>
<style lang="scss">
.v-breadcrumbs__prepend {
    .mdi-home-circle {
        margin-right: 4px;
    }
}

.layout_title+div {
    padding-top: 0;
    margin-top: 0;
}
</style>
