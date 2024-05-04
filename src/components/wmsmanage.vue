<script setup >

import adminarrival from './adminarrival.vue';
import wmssimpleview from './wmssimpleview.vue';
import { ref, reactive, nextTick } from 'vue'
const wmsview = ref()
const adminarr = ref()

const tabsConfig = [
    {
        value: 'wmssimpleview',
        icon: 'mdi-home-variant',
        tabName: '仓库一览'
    },
    {
        value: 'adminarrival',
        icon: 'mdi-truck-cargo-container',
        tabName: '预收货'
    }
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
                case 'adminarrival':
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
                        <v-window-item value="wmssimpleview" >
                            <wmssimpleview ref="wmsview"  />
                        </v-window-item>
                        <v-window-item value="adminarrival">
                            <adminarrival ref="adminarr" />
                        </v-window-item>
                    </v-window>
                
            </v-card>
        
    </v-container>
</template>
<style></style>