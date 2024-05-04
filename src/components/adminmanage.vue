<script setup >
import adminfclconfig from '../components/adminfclconfig.vue';
import adminlclconfig from '../components/adminlclconfig.vue';

import { ref, reactive, nextTick } from 'vue'
const adminFCL = ref()
const adminLCL = ref()

const tabsConfig = [
    {
        value: 'adminfclconfig',
        icon: 'mdi-ferry',
        tabName: '整箱',
    },
    {
        value: 'adminlclconfig',
        icon: 'mdi-package-variant-closed',
        tabName: '拼箱'
    },
    
]
const data = reactive({
    activeTab: '',
    isLoadstockLocation: false,
    isLoadstock: false
})

const method = reactive({
    changeTabs: function (e) {
        nextTick(function () {
            switch (e) {
                case 'adminfclconfig':
                    break;
                case 'adminlclconfig':
                    break;
            }
        });
    }
});
</script>
<template>
    <v-container class="pa-0">
        
            <v-tabs v-model="data.activeTab" stacked @update:model-value="method.changeTabs" > 
                <v-tab v-for="(item, index) of tabsConfig" :key="index" :value="item.value">
                    <v-icon>{{ item.icon }}</v-icon>
                    <p class="tabItemTitle">{{ item.tabName }}</p>
                </v-tab>
            </v-tabs>

            <!-- Main Content -->
            <v-card >
                
                    <v-window v-model="data.activeTab" >
                        <v-window-item value="adminfclconfig" >
                            <adminfclconfig ref="adminFCL"  />
                        </v-window-item>
                        <v-window-item value="adminlclconfig">
                            <adminlclconfig ref="adminLCL" />
                        </v-window-item>
                    </v-window>
                
            </v-card>
        
    </v-container>
</template>
<style></style>

