import './assets/main.css'
import '@mdi/font/css/materialdesignicons.css'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify'
import App from './App.vue'
import router from './router'
import 'vuetify/styles'
import axios from 'axios'
import VueApexCharts from "vue3-apexcharts";
import Vue3Lottie from "vue3-lottie";
import PerfectScrollbar from "vue3-perfect-scrollbar";
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import apiConfig from './api/config'

const vuetify = createVuetify({
  components,
  directives,
})

axios.defaults.baseURL = apiConfig.baseUrl;


export default createVuetify({
  icons: {
    defaultSet: 'mdi', // This is already the default value - only for display purposes
  },
})

const app = createApp(App)
app.use(VueApexCharts);
app.use(PerfectScrollbar);
app.use(Vue3Lottie, { name: "LottieAnimation" });
app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')
