<script setup>
import { useCustomizeThemeStore } from "@/stores/Theme.js";
const customizeTheme = useCustomizeThemeStore();
const openSchoolSite = () => {
  window.open("https://www.gench.edu.cn/", "_blank");
};

</script>
<template>
  <v-navigation-drawer v-model="customizeTheme.mainSidebar" class="bg-blue" theme="dark">
    <v-list nav>
      <v-list-item prepend-icon="mdi-file-find" title="运价和船期查询" value="pricesearch"
        :to="'/index/shipsearch'"></v-list-item>
      <v-list-item prepend-icon="mdi-view-dashboard" title="报价订阅" value="subscribe"
        :to="'/index/subscribe'"></v-list-item>
      <v-list-item prepend-icon="mdi-currency-usd" title="我的报价单" value="mylist" 
        :to="'/index/quotation'"></v-list-item>
      <v-list-item prepend-icon="mdi-page-next-outline" title="我的询盘" value="myinquiry"
        :to="'/index/inquiry'"></v-list-item>
      <v-list-item prepend-icon="mdi-receipt-text-check-outline" title="提交货单" value="pickarrival"
        :to="'/index/arrival'"></v-list-item>  
      <v-list-item prepend-icon="mdi-gavel" title="上传单据" value="fileman"
        :to="'/index/file'"></v-list-item>

    </v-list>


    <template v-if="!customizeTheme.miniSidebar" v-slot:append>
      <v-card theme="dark" height="225" class="pa-3" variant="text"
        style="box-shadow: rgba(0, 0, 0, 0.05) 0px -25px 15px -20px">
        <v-card class="d-flex flex-column gradient pa-2" :class="customizeTheme.primaryColor.colorName" height="200">

          <v-card-title>

            <v-btn class="mr-2" size="40" color="white" :class="`text-${customizeTheme.primaryColor.colorName}`" icon>

              <v-icon width="30" icon="mdi-google-downasaur"></v-icon>


            </v-btn>
            葛邵俊
          </v-card-title>
          <v-card-subtitle> </v-card-subtitle>
          <v-card-text>
            <div><b>上海建桥学院:</b></div>
            <div>www.gench.edu.cn</div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="white" block prepend-icon="mdi-school" variant="elevated" @click="openSchoolSite">
              Visit
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-card>
    </template>
  </v-navigation-drawer>
</template>
<script>


</script>