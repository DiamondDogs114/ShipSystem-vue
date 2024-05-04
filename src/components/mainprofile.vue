<script setup>
import { useDisplay } from 'vuetify'

const { mdAndUp } = useDisplay()

const openSchoolSite = () => {
  window.open("https://www.gench.edu.cn/", "_blank");
};

const opensteamsite = () => {
  window.open("https://steamcommunity.com/id/Diamond-Dog", "_blank");
};

</script>
<template>
  <v-card flat>
    <v-container>
      <v-row no-gutters class="h-100 pa-md-5">
        <v-col cols="12" sm="12" md="6">
          <v-card-text class="d-flex flex-column justify-center h-100">
            <h3 class="text-lg-h3 text-h4 font-weight-light mb-4">
              Diamond_Dogs
            </h3>

            <span class="text-grey-darken-1"><b>作者</b></span><br>

            <p class="text-grey-darken-1 mb-4">
              本名:葛邵俊 来自上海建桥学院
            </p>
            <p class="text-grey-darken-1 mb-4">
              做完这个给了我一个深刻的道理,那就是以后vue3还是得用typescript
            </p>

            <div>
              <v-tooltip text="访问学校" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn color="primary" v-bind="props" icon="mdi-pound" @click="openSchoolSite" />
                </template>
              </v-tooltip>
              <v-tooltip text="访问Steam" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn class="ma-4" v-bind="props" color="grey" icon="mdi-steam" @click="opensteamsite" />
                </template>
              </v-tooltip>
              <v-tooltip text="geshaojun631@gmail.com" location="bottom">
                <template v-slot:activator="{ props }">
                  <v-btn color="grey" v-bind="props" icon="mdi-google" />
                </template>
              </v-tooltip>
            </div>
          </v-card-text>
        </v-col>

        <v-col cols="12" sm="12" md="5" offset-md="1" class="d-flex flex-column justify-center align-center pa-5">
          <v-avatar :size="mdAndUp ? 300 : 88" elevation="12">
            <v-img src="https://avatars.akamai.steamstatic.com/04936d6b83be2b9153ccec93ff21c180fb0cc5f0_full.jpg" />
          </v-avatar>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>
