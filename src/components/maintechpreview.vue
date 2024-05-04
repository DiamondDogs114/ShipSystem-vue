<template>
    <v-card class="pa-8" flat>
      <v-row>
        <v-col
          lg="4"
          md="4"
          sm="8"
          cols="12"
        >
        <v-hover v-slot="{ isHovering, props }">
        <v-card
            class="mb-8"
            color="grey-lighten-4"
            height="250"
            v-bind="props"
          >
            <v-img
              :aspect-ratio="16/9"
              cover
              src="https://pic1.zhimg.com/v2-12b4d7b0d929c2e41257f6d4537a5db8_1440w.jpg?source=172ae18b"
            >
              <v-expand-transition>
                <div
                  v-if="isHovering"
                  class="d-flex transition-fast-in-fast-out bg-green v-card--reveal text-h2"
                  style="height: 100%;"
                >
                  后端
                </div>
              </v-expand-transition>
            </v-img>
          </v-card>
          </v-hover>
  
  
  
          <div class="text-center">
            <div class="text-subtitle-2 font-weight-bold mb-4">
              后端————SpringBoot
            </div>
  
            <div class="text-medium-emphasis mb-8">
              本系统后端基本依靠SpringBoot,持久层使用JPA,数据库使用MySQL和Redis
            </div>
  
            <div>
              <v-btn
                color="primary"
                prepend-icon="mdi-open-in-new"
                elevation="13"
                size="large"
                text="前往Springboot官网"
                @click="openSpringBootSite"
              />
            </div>
          </div>
        </v-col>
  
        <v-col
          lg="4"
          md="4"
          sm="8"
          cols="12"
        >
        <v-hover v-slot="{ isHovering, props }">
        <v-card
            class="mb-8"
            color="grey-lighten-4"
            height="250"
            v-bind="props"
          >
            <v-img
              :aspect-ratio="16/9"
              cover
              src="https://img2.baidu.com/it/u=4002938427,987737150&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500"
            >
              <v-expand-transition>
                <div
                  v-if="isHovering"
                  class="d-flex transition-fast-in-fast-out bg-blue v-card--reveal text-h2"
                  style="height: 100%;"
                >
                  前端
                </div>
              </v-expand-transition>
            </v-img>
          </v-card>
          </v-hover>
  
          <div class="text-center">
            <div class="text-subtitle-2 font-weight-bold mb-4">
              前端————Vue全家桶
            </div>
  
            <div class="text-medium-emphasis mb-8">
              前端基本依靠vue来进行构建,还包括vue-router,pinia等vue基本的框架
            </div>
  
            <div>
              <v-btn
                color="primary"
                prepend-icon="mdi-open-in-new"
                elevation="13"
                size="large"
                text="前往Vue官网"
                @click="openVueSite"
              />
            </div>
          </div>
        </v-col>
  
        <v-col
          lg="4"
          md="4"
          sm="8"
          cols="12"
        >
        <v-hover v-slot="{ isHovering, props }">
        <v-card
            class="mb-8"
            color="grey-lighten-4"
            height="250"
            v-bind="props"
          >
            <v-img
              :aspect-ratio="16/9"
              cover
              src="https://d1tlzifd8jdoy4.cloudfront.net/wp-content/uploads/2022/09/vuetify-eyecatch-960x504.png"
            >
              <v-expand-transition>
                <div
                  v-if="isHovering"
                  class="d-flex transition-fast-in-fast-out bg-cyan-lighten-3 v-card--reveal text-h2 text-white"
                  style="height: 100%;"
                >
                  UI
                </div>
              </v-expand-transition>
            </v-img>
          </v-card>
          </v-hover>
  
          <div class="text-center">
            <div class="text-subtitle-2 font-weight-bold mb-4">
              UI————Vuetify
            </div>
  
            <div class="text-medium-emphasis mb-8">
             前端整体UI使用的是国外的Vuetify框架,是一个旨在提供干净、语义和可重用的组件式UI框架。
            </div>
  
            <div>
              <v-btn
                color="primary"
                prepend-icon="mdi-open-in-new"
                elevation="13"
                size="large"
                text="前往Vuetify官网"
                @click="openVuetifySite"
              />
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </template>
  
  <script lang="ts" setup>
  const openSpringBootSite = () => {
  window.open("https://spring.io/projects/spring-boot", "_blank");
};

const openVueSite = () => {
  window.open("https://cn.vuejs.org/", "_blank");
};
const openVuetifySite = () => {
  window.open("https://vuetifyjs.com/zh-Hans/", "_blank");
};


  </script>
  
  <style>
  .v-card--reveal {
    align-items: center;
    bottom: 0;
    justify-content: center;
    opacity: .9;
    position: absolute;
    width: 100%;
  }
  </style>