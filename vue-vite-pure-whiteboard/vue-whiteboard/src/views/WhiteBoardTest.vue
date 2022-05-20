<script setup>
import WhiteBoard from '../../../pure-whiteboard'
import {onMounted} from "vue";

onMounted(() => {
  const canvasWrapper = document.getElementById('canvas')
  const wb = new WhiteBoard(canvasWrapper, {

  })
})

</script>

<template>
  <div>
    <div id="canvas" class="bg-pink-100"></div>
  </div>
</template>

<style scoped></style>