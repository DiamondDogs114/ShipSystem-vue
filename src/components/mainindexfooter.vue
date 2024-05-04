<template>
    <v-card theme="dark" color="#0d2141">
      <v-container class="text-center py-12">
        <div class="d-inline-block">
          <v-list-item slim>
            
  
            <v-list-item-title class="text-h6">
              <strong class="font-weight-black">海运</strong>
  
              万事通
            </v-list-item-title>
          </v-list-item>
        </div>
  
        <div class="my-16">
          <v-btn v-for="link in links" :key="link" :text="link" variant="text" class="mx-2 text-grey-darken-1" rounded />
        </div>
  
        <div class="text-center mt-10 text-grey-darken-1" cols="12">
          All rights are reserved &copy;
          {{ new Date().getFullYear() }},Bulid By Diamond_Dogs, Vue, Vuetify
        </div>
      </v-container>
    </v-card>
  </template>
  
  <script lang="ts" setup>
  const links = [
    'Home',
    'About Us',
    'Portfolio',
    'Services',
    'Contact'
  ]
  </script>
  