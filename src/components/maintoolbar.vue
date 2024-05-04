<script setup>
import { useCustomizeThemeStore } from "@/stores/Theme.js";
import { useDisplay } from "vuetify";
import toolbarUser from "./toolbarUser.vue";
import usernotification from "./usernotification.vue";
import userchat from "../components/userchat.vue"

const customizeTheme = useCustomizeThemeStore();
const { mdAndUp } = useDisplay();

</script>
<template>
  <v-app-bar app dark  :density="mdAndUp ? 'default' : 'compact'" :elevation="1">


    <v-app-bar-nav-icon @click="customizeTheme.mainSidebar = !customizeTheme.mainSidebar"></v-app-bar-nav-icon>
    <v-list-item  slim>
  <v-list-item-title class="text-h6">
    <strong class="font-weight-black">海运</strong>
    万事通
    <span  style="font-size: 14px" class="text-grey ml-2">您的专业海运管家</span>
  </v-list-item-title>
  
</v-list-item>

    <v-spacer></v-spacer>
    <v-tooltip text="首页" location="bottom">
      <template v-slot:activator="{ props }">

        <router-link v-bind="props" to="/index" class="text-black">
          <v-btn class="text-none" icon>

            <v-icon color="blue">mdi-home-outline</v-icon>

          </v-btn>
        </router-link>
      </template>
    </v-tooltip>
    <userchat />
    <v-tooltip text="设置" location="bottom">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" class="text-none" icon @click.stop="customizeTheme.userconfig = !customizeTheme.userconfig">

          <v-icon>mdi-cog</v-icon>

        </v-btn>
      </template>
    </v-tooltip>
    <v-divider vertical thickness="2" inset class="ml-5 mr-1"></v-divider>
    
    <usernotification />
    <toolbarUser></toolbarUser>


  </v-app-bar>
</template>
  
      
  
     
      
   
 
 