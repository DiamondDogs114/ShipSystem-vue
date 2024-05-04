<script setup lang="ts">
const articles = [
  {
    id: 1,
    title: "全球自拼箱",
    image:
      "http://www.vastfreight.com/skins/images/img7.jpg",
    
    
    author: "了解详情",
    content:
      "全球自拼箱进出口直拼航线超过150+条，覆盖亚洲 澳洲 欧洲 地中海 美国 加拿大 非洲 南美 加勒比。",
  },
  {
    id: 2,
    title: "全球整箱",
    image:
      "http://www.vastfreight.com/skins/images/img8.jpg",
    
    
    author: "了解详情",
    content:
      "航线覆盖：东南亚、韩国、日本、港澳台、中东、印巴、红海、非洲、欧地、中南美、美国。",
  },
  {
    id: 3,
    title: "仓库 & 拖车& 报关",
    image:
      "http://www.vastfreight.com/skins/images/img12.jpg",
    
    author: "了解详情",
    content:
      "上海设有自有拼箱仓库占地30000平，全国各地设有中转仓库方便客户就近送货。 ",
  },
];
</script>
<template>
 

  <v-sheet elevation="0"
      class="mx-auto landing-warpper text-left"
      rounded
      >
    <v-sheet elevation="0"
        color="transparent"
        max-width="1600 "
        class="mx-auto my-10">
      <v-container>
        <v-row align="center">
          <v-col cols="12" md="4" v-for="item in articles" :key="item.id">
            <v-card max-width="400" class="mx-auto">
              <v-img cover :src="item.image" height="200px"></v-img>
              <v-card-title class="text-h6 font-weight-bold">
                {{ item.title }}
              </v-card-title>
              
              <v-card-text>
                {{ item.content }}
              </v-card-text>
              <v-divider></v-divider>
              <v-card-actions>
                <v-btn text-color="primary">
                  <v-icon class="mr-2">mdi-chevron-right</v-icon>
                  {{ item.author }}
                </v-btn>
              
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-sheet>
  </v-sheet>
</template>