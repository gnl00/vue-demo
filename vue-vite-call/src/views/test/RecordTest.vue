<!-- https://blog.csdn.net/qq_41619796/article/details/107865602 -->
<script setup>
import Recorder from 'js-audio-recorder';
import {reactive, ref} from "vue";

let files = ref([])
let currentFile = reactive({
  name: '',
  url: ''
})
let recordTime = ref(0)
// let recordFlag = ref(null)

const recorder = new Recorder();

recorder.onprogress = (payload) => {
  console.log(recorder)
}

recorder.onprocess = (duration) => {
  recordTime.value = duration
}

// console.log(recorder)

const onStart = () => {
  // getTime()
  recorder.start().then(() => {
    console.log('start success')
  }).catch(() => {
    console.log('start error')
  })
}

const onPause = () => {
  recorder.pause()
  // clearInterval(recordFlag.value)
}

const onResume = () => {
  // getTime()
  recorder.resume()
}

const onStop = () => {
  recorder.stop()
  // clearInterval(recordFlag.value)
}

const onDownload = () => {
  recorder.downloadWAV('record-' + (new Date().getTime() + ''))
}

const onPlay = () => {
  recorder.play()
}

const onPausePlay = () => {
  recorder.pausePlay()
}

const onResumePlay = () => {
  recorder.resumePlay()
}

// 获取上传的文件信息
const handleAfterRead = (file) => {
  // console.log(file)
  // console.log(files.value)
  currentFile.name = file.name
  currentFile.url = file.url
  // console.log(currentFile)
}

// const getTime = () => {
//   recordFlag.value = setInterval(() => {
//     recordTime.value += 10
//   }, 10)
// }

</script>

<template>
  <div class="space-y-8">
    <h1 class="bg-blue-100 text-center text-3xl">Record-Test</h1>

    <div class="flex flex-col justify-center items-center space-y-2">
      <div class="space-x-2">
        <var-button type="success" @click="onStart">Start</var-button>
        <var-button type="info" @click="onPause">Pause</var-button>
        <var-button type="default" @click="onResume">Resume</var-button>
        <var-button type="danger" @click="onStop">Stop</var-button>
        <var-button type="warning" @click="onDownload">Download</var-button>
      </div>
      <div class="space-x-2">
        <var-button type="primary" @click="onPlay">Play</var-button>
        <var-button type="warning" @click="onPausePlay">PausePlay</var-button>
        <var-button type="info" @click="onResumePlay">ResumePlay</var-button>

      </div>
      <div>{{(recordTime).toFixed(3)}}</div>
    </div>

    <div class="w-full p-2 space-y-4 flex flex-col justify-center items-center">
      <h2>Play Area</h2>

      <div>
        <var-uploader v-model="files" @after-read="handleAfterRead" accept="*"/>
      </div>

      <div class="flex justify-center items-center space-x-2">
        <span>{{currentFile.name}}</span>
        <audio controls :src="currentFile.url" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>