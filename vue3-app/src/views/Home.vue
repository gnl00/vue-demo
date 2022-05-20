<template>
  <div id="home">
    <h1>Some content in Home page.</h1>
    <hr>
    <Parent />
  </div>
</template>

<script>

import Parent from "@/views/Parent";
export default {
  name: "Home",
  components: {
    Parent
  },
}
</script>

<style scoped>

</style>