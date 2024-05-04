<script setup lang="ts">
import { RouterLink } from "vue-router";

const navs = [
  {
    title: "产品",
    icon: "mdi-home",
    to: "/",
    subNavs: [
      {
        title: "产品一览",
        to: "/",
      },
      {
        title: "特征",
        to: "/",
      },
      {
        title: "价格详情",
        to: "/",
      },
    ],
  },
  {
    title: "来源",
    icon: "mdi-home",
    to: "/",
    subNavs: [
      {
        title: "法律信息",
        to: "/",
      },
      {
        title: "新闻",
        to: "/",
      },
      {
        title: "FAQ",
        to: "/",
      },
    ],
  },
  {
    title: "公司",
    icon: "mdi-home",
    to: "/",
    subNavs: [
      {
        title: "关于我们",
        to: "/",
      },
      {
        title: "专业",
        to: "/",
      },
      {
        title: "出版",
        to: "/",
      },
    ],
  },
  {
    title: "联系",
    icon: "mdi-home",
    to: "/",
    subNavs: [
      {
        title: "联系我们",
        to: "/",
      },
      {
        title: "联系人",
        to: "/",
      },
      {
        title: "微信",
        to: "/",
      },
    ],
  },
];
</script>

<template>
  

  <v-sheet
    elevation="0"
    class="mx-auto landing-warpper"
    color="#F2F5F8"
    rounded
  >
    <v-card class="text-left pa-10" >
      <v-sheet
        class="mx-auto"
        color="transparent"
        elevation="0"
        max-width="1600"
        
      >
        <v-row>
          <v-col cols="12" md="8">
            <v-row>
              <v-col cols="12" md="3" v-for="nav in navs">
                <p class="text-h6 mb-4">
                  <b>{{ nav.title }}</b>
                </p>
                <p
                  class="text-body-2 text-primary mb-2"
                  v-for="subNav in nav.subNavs"
                  :key="subNav.title"
                >
                  <router-link :to="nav.to">
                    {{ subNav.title }}
                  </router-link>
                </p>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="4">
            
            <p class="my-4">just do it!</p>
          </v-col>
        </v-row>
      </v-sheet>
    </v-card>
  </v-sheet>
  <v-footer class="bg-grey-lighten-1">
            <v-row justify="center" no-gutters>
                <v-btn v-for="link in links" :key="link" color="white" variant="text" class="mx-2" rounded="xl">
                    {{ link }}
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn v-for="icon in icons" :key="icon" class="mx-4" :icon="icon" variant="plain" size="small"></v-btn>

                <v-col class="text-center mt-4" cols="12">
                    {{ new Date().getFullYear() }} — <strong>海运万事通 by Diamond_Dogs</strong>
                </v-col>
            </v-row>

        </v-footer>
</template>
<script lang="ts">
export default {

    data: () => ({
        links: [
            'Home',
            'Team',
            'Services',
            'Blog',

        ],
        icons: ['mdi-facebook', 'mdi-twitter', 'mdi-linkedin', 'mdi-instagram'],
    }),
}
</script>
