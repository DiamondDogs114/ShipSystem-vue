<template>
    <v-card  class="pa-3 ma-3" elevation="1">
      <v-card-title class="my-4 text-h4 d-flex justify-center">
        
        <span  > 今日新闻 </span>
      </v-card-title>
    <v-sheet elevation="0" class="mx-auto landing-warpper" rounded>
      <v-sheet max-width="1600" class="mx-auto pa-5" elevation="0">
      <v-container >
        <v-carousel  cycle height="600" hide-delimiter-background show-arrows="hover">
          <v-carousel-item
            src="http://djupload.oss-cn-beijing.aliyuncs.com/etrans56/news/980e8458249043de8e98cc0c17dbfb60.png"
            cover
          ></v-carousel-item>
        
          <v-carousel-item
            src="http://djupload.oss-cn-beijing.aliyuncs.com/etrans56/messagess/ab52fe21e04a4f1ea68536bc56f78bc1.png"
            cover
          ></v-carousel-item>
        
          <v-carousel-item
            src="http://djupload.oss-cn-beijing.aliyuncs.com/etrans56/news/162a3a1ffc5047579a436f95078e81b8.png"
            cover
          ></v-carousel-item>
        </v-carousel>
      </v-container>
      </v-sheet>
      </v-sheet>
    </v-card>
  </template>