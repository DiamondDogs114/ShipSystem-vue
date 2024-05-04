<template>
  
    <v-sheet
      elevation="0"
      class="mx-auto landing-warpper text-left"
      rounded
      theme="light"
    >
      <v-sheet
        elevation="0"
        color="transparent"
        max-width="1600 "
        class="mx-auto my-10"
      >
        <v-row no-gutters align="stretch">
          <v-col cols="12">
            <v-card
              elevation="0"
              height="100%"
              class="mx-auto pa-10 pa-md-15 d-flex flex-column justify-center"
              image="https://djupload.oss-cn-beijing.aliyuncs.com/etrans56/topSupplier/7a006c875ccd4dff821446084d45a4ca.jpg"
            >
              <div>
                <RouterLink to="/" class="text-white font-weight-bold"
                  >WORK WITH US</RouterLink
                >
                <h1 class="font-weight-black text-h3 mt-5 mb-10 text-white" >
                  Get your startup ready for
                  <span class="text-red">Business</span>
                </h1>
                <p class="text-white">
                  提供专业的国际物流运价查询和货物跟踪
                </p>
                <router-link to="/index/shipsearch" class="text-black">
                <v-btn color="primary" size="large" class="mt-10"
                  >马上上船</v-btn>
                </router-link>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12">
            <v-card height="100%"> </v-card>
          </v-col>
        </v-row>
      </v-sheet>
    </v-sheet>
  </template>