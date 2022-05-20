<script setup>

import {ref} from "vue";

let localStream = ref(null)
let videoDom = ref(null)

const getVideoAndAudio = () => {
  navigator.mediaDevices.getUserMedia({
    video: {
      width: 250,
      height: 250
    },
    audio: false
  }).then(stream => {
    if (stream) {
      localStream.value = stream
      videoDom.value.srcObject = stream

      // 设置视频播放音量为 0
      videoDom.value.volume = 0
      // 设置视频自动播放
      videoDom.value.play()
      // console.log(videoDom)
    }
  })
}

const onVideoStart = () => {
  getVideoAndAudio()
}

</script>

<template>
  <div class="flex flex-col space-y-4">
    <div class="bg-red-200">
      <h1 class="text-3xl text-center">Video-Test</h1>
    </div>

    <div class="flex justify-center items-center">
      <var-button type="primary" @click="onVideoStart">VideoStart</var-button>
    </div>

    <div class="flex justify-center items-center">
      <video class="rounded" ref="videoDom" />
    </div>
  </div>
</template>

<style scoped></style>