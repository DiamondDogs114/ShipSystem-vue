<script setup>
  import { useRoute } from 'vue-router';
  import { ref, watchEffect } from 'vue';
  
  const route = useRoute();
  const breadcrumbs = ref([]);
  
  watchEffect(() => {
    // if you go to the redirect page, do not update the breadcrumbs
    // if (route.path.startsWith('/redirect/')) {
    //   return
    // }
    if (route.meta && route.meta.title) {
      breadcrumbs.value = [
        {
          title: route.meta.category,
          disabled: false,
        },
        { title: route.meta.title, disabled: true },
      ];
    } else {
      breadcrumbs.value = [];
    }
  });
  </script>
<template>
    <v-breadcrumbs
      v-if="breadcrumbs.length > 0"
      :items="breadcrumbs"
      class="ml-n3 text-body-2 "
      
      
    >
    </v-breadcrumbs>
  </template>
  
  