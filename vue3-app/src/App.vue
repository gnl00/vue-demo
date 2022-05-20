<template>
  <div id="root">
    <img alt="Vue logo" src="./assets/logo.png">
    <h2>App.vue</h2>
    <router-link to="/web"><strong>Home</strong></router-link> |
    <router-link to="/myComp"><strong>MyComp</strong></router-link>
    <hr>
    <router-view></router-view>
  </div>
</template>

<script>

export default {
  name: 'App',
  components: {}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
