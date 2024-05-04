<template>
    
    <v-card >
        <v-parallax src="https://cdn.vuetifyjs.com/images/parallax/material.jpg">
      <v-layout class="fill-height">
        <v-app-bar color="transparent" flat height="96" >
          <template v-if="mdAndUp" #prepend>
            <v-list-item  slim>
  
  
              <v-list-item-title class="text-h6">
                <strong class="font-weight-black">海运</strong>
  
                万事通
              </v-list-item-title>
            </v-list-item>
          </template>
  
          <template #append>
            <div v-if="mdAndUp">
            <router-link to="/index" class="text-white">
              <v-btn text="首页" />
            </router-link>
  
              <v-btn text="关于我们" />
  
              <v-btn text="服务" />
  
              <v-btn text="联系" />
            </div>
            <router-link to="/reg">
            <v-btn class="ms-6 me-2" color="primary" size="large" text="注册" variant="elevated" width="128" />
            </router-link>
            <router-link to="/login">
            <v-btn class="mx-2" size="large" text="登录" variant="outlined" width="128" />
            </router-link>
          </template>
        </v-app-bar>
  
        <v-main>
          <v-container class="py-16 px-12">
            <v-row align="center">
              <v-col cols="12" md="6">
                <h1 class="text-h3 mb-4">
                  海运万事通
                </h1>
                <h1 class="text-h3 mb-4">
                  GET here for
  
                  <br>
  
                  <strong>Business_</strong>
                </h1>
  
                <div class="text-medium-emphasis text-body-2 mb-12">
                  你最好的海运物流管家.
                </div>
  
                <v-btn color="primary" size="large" text="立马启程" />
              </v-col>
  
              <v-col cols="12" md="6">
                <Vue3Lottie :animationData="dataJson" />
              </v-col>
            </v-row>
          </v-container>
        </v-main>
      </v-layout>
    </v-parallax>
    </v-card>

  </template>
  
  <script lang="ts" setup>
  import { useDisplay } from 'vuetify'
  import { Vue3Lottie } from 'vue3-lottie'
  
  import dataJson from '../assets/NyaCat.json'
  
  const { mdAndUp } = useDisplay()
  </script>
  