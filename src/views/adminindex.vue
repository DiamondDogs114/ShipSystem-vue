<script setup>
import SalesCard from "../components/SalesCard.vue";
import indexcompanyinfo from "../components/indexcompanyinfo.vue";
import indexadmininquiry from "../components/indexadmininquiry.vue"
import { Vue3Lottie } from 'vue3-lottie'
import dataJson from '../assets/warehouse.json'
const storedUser = JSON.parse(localStorage.getItem('admin'));
</script>
<template >
    <div class="pa-5" v-if="storedUser.usertype=='1'">
        <v-row class="flex-0" dense>
            <v-col cols="12" xl="4">
                <!-- Sales Card -->
                <v-card height="420">
                    <sales-card  class="h-100" 
                        style="min-height: 380px"></sales-card>
                </v-card>
            </v-col>
            <v-col cols="12" md="6" xl="4">
                <!-- company Card -->
                <v-card height="420">
                    <v-toolbar class="font-weight-bold bg-cyan-lighten-2">

                        <span class="text-h6 pa-6">现有公司</span>
                        <v-spacer></v-spacer>
                        <router-link to="/admincompany" class="text-primary pr-2">
                            <v-btn size="small" variant="text" icon="mdi-chevron-right-circle" rounded color="primary"
                                class="my-n2"></v-btn>
                        </router-link>
                    </v-toolbar>
                    <v-card-text>

                        <indexcompanyinfo />
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" md="6" xl="4">
                <!-- inquiry Card-->
                <v-card  height="420">
                    <v-toolbar class="font-weight-bold bg-cyan-lighten-2">

                        <span class="text-h6 pa-6">询价通知</span>
                        <v-spacer></v-spacer>
                        <router-link to="/admininq" class="text-primary pr-2">
                            <v-btn size="small" variant="text" icon="mdi-chevron-right-circle" rounded color="primary"
                                class="my-n2"></v-btn>
                        </router-link>
                    </v-toolbar>
                    <v-card-text>
                        <indexadmininquiry />
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
    <div class="container" v-if="storedUser.usertype=='2'">
    <div class="textBox">
      <div class="mainTitle">海运万事通</div>
      <div class="subTitle">by Diamond_Dogs</div>
    </div>
    <div class="content">
      <div class="lottieBox">
        <Vue3Lottie :animationData="dataJson"></Vue3Lottie>
      </div>
    </div>
  </div>
</template>
<script>

</script>
<style scoped lang="scss">
.container {
  width: 100%;
  height: 585px;
  display: flex;
  justify-content: center;
  position: relative;
  align-items: center;
}

.content {
  width: 60%;
}

.textBox {
  width: 100%;
  position: absolute;
  left: 50%;
  top: 5%;
  transform: translate(-50%, 0);
  letter-spacing: 5px;
  z-index: 999;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.mainTitle {
  display: flex;
  justify-content: center;
  width: 100%;
  color: #27a2b0;
  font-weight: bold;
  font-size: 75px;
}

.subTitle {
  display: flex;
  justify-content: center;
  width: 100%;
  font-size: 30px;
  letter-spacing: 5px;
  color: #a7cecf;
}

.lottieBox {
  min-width: 100%;
  max-width: 100%;
}
</style>
