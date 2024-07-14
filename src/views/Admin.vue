<template>
  <div class="background"></div>
  <a-layout>
    <Nav />
    <a-layout>
      <a-layout-header style="background-color:rgba(255, 255, 255,0.15);">
        <Header></Header>
      </a-layout-header>
      <a-layout style="background-color:rgba(255, 255, 255,0); "
        :style="{ 'min-height': windowSizeHeight - 135 + 'px' }">
        <router-view :key="$route.path">
        </router-view>
      </a-layout>
      <a-layout-footer style="background-color:rgba(255, 255, 255,0);">
        <Footer></Footer>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script setup>
import Nav from "../components/Nav.vue"
import Footer from "../components/Footer.vue"
import { useWindowSize } from '@vueuse/core';
let windowSizeWidth = useWindowSize().width
let windowSizeHeight = useWindowSize().height
</script>