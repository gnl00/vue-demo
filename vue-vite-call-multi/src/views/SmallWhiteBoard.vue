<script setup>
import {onMounted, ref} from "vue";

let canvas = ref()

onMounted(() => {
  console.log(canvas)
})

</script>

<template>
  <div>
    <div class="bg-indigo-100 text-3xl text-center">
      <h1>Small White Board</h1>
    </div>

    <div class="flex justify-center items-center m-2">
      <canvas ref="canvas" class="bg-gray-100" width="800" height="600"></canvas>
    </div>

  </div>
</template>

<style scoped></style>