<script setup>


import maintoolbar from '../components/maintoolbar.vue';
import usersidebar from '../components/usersidebar.vue';
import userconfig from '../components/userconfig.vue';

</script>

<template>
    <maintoolbar />
    <usersidebar />
    <userconfig />
    <v-main>
        
        <div>
            <slot>

            </slot>
        </div>
    </v-main>
</template>