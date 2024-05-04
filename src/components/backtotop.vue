<script setup>
  import * as Vue from 'vue';
  import { ref } from 'vue';

const onMounted = Vue.onMounted;
const onUnmounted = Vue.onUnmounted;
 

const isVisible = ref(false);

const handleScroll = () => {
  isVisible.value = window.scrollY > 200;
};

onMounted (() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted (() => {
  window.removeEventListener("scroll", handleScroll);
});



const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};
</script>
<template>
   <div class="back-to-top" :class="{ visible: isVisible }" @click="scrollToTop">
    <v-icon class="text-white" width="30" icon="mdi-arrow-up-thick" />
  </div>
</template>
<style scoped >
.back-to-top {
  position: fixed;
  background-color: skyblue;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  bottom: 50px;
  right: 5px;
  z-index: 999;
  padding: 0.5rem;
  border-radius: 0.5rem;
  box-shadow: 1px 1px 9px skyblue;
  transition: all 0.5s;
  cursor: pointer;
  
}
.back-to-top:hover{
  box-shadow: 1px 1px 18px skyblue;
    transition: all 0.5s;

}

.back-to-top.visible {
  opacity: 1;
  visibility: visible;
}
</style>
  
  