<script setup>


import maintoolbar from '../components/maintoolbar.vue';
import usersidebar from '../components/usersidebar.vue';
import breadcrumb from '../components/breadcrumb.vue';
import userconfig from '../components/userconfig.vue';

</script>

<template>
    <maintoolbar />
    <usersidebar />
    <userconfig />
    <v-main>
        <div class="d-none d-sm-block px-3">           
            <breadcrumb></breadcrumb>
        </div>
        <div>
            <slot>

            </slot>
        </div>
    </v-main>
</template>
  
