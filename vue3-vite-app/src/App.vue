<script setup>
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import NavBar from "./components/navBar/NavBar.vue";
import Footer from "./components/footer/Footer.vue";
</script>

<template>
  <!-- 每个页面都固定导航栏 -->

  <NavBar />

  <router-view></router-view>

  <Footer />

</template>

<style lang="less">
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  border: #373837 solid 4px;
}

</style>
