<script setup>

const mediaConstraints = {
  audio: true,
  video: {
    width: 500,
    height: 500
  }
}

import { ref, onMounted } from 'vue'

let isPlay = ref(false)
let audioRef = ref(null)

// 请求使用摄像头 or 麦克风
navigator.mediaDevices.getUserMedia({
  audio: true,
  video: false
}).then(stream => {
  if (stream) {
    // recorder.init(stream)
    audioRef.value.srcObj = stream
  }
}).catch(err => {
  console.log(err)
})



onMounted(() => {
  // console.log(audioRef.value)
  // audioRef.value.play()
})

const onStartClick = (evt) => {
  // console.log('onStartClick ', evt)
  // console.log(isPlay)
  // if (!isPlay.value) {
  //   audioRef.value.play()
  //   isPlay.value = true
  // } else {
  //   audioRef.value.pause()
  //   isPlay.value = false
  // }

  console.log(audioRef)
}

const onEndClick = (evt) => {
  console.log('onEndClick ', evt)
}

</script>

<template>
  <h1 class="bg-blue-100 text-3xl p-2">1</h1>

  <div class="bg-amber-200 p-2 space-x-2">
    <button class="bg-gray-200 p-2" @click="evt => onStartClick(evt)">{{isPlay ? "Pause" : 'Start'}}</button>
    <button class="bg-gray-200 p-2" @click="evt => onEndClick(evt)">end</button>
  </div>

  <div>
    <audio ref='audioRef' src="./src/assets/audio/test.mp3" controls />
    <video style="width: 320px; height: 240px" ref='videoRef' controls >
      <source src="@/assets/video/test.ogg" type="video/ogg" />
    </video>
  </div>

  <div>
    <var-button>默认按钮</var-button>
    <var-button type="primary">主要按钮</var-button>
  </div>

</template>

<style scoped></style>