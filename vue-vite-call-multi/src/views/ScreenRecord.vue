<script setup>
/**
 * 实现摄像头和录屏视频流的切换
 * 利用 addTracks() 和 removeTracks() 修改 <video> 标签的 srcObject 的 stream 来源即可
 * 切换之后需要重新建立 WebRTC 连接
 */

import { ref } from "vue";

let localVideo = ref(null)

let replayVideo = ref(null)
// 录制视频，进行重放或者保存本地操作
let recorder = ref(null)
let chunks = ref([])
let videoDownloadURL = ref('')

const initVideoSrc = async () => {
  // https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices/getDisplayMedia
  const localStream = await navigator.mediaDevices.getDisplayMedia({
    audio: false,
    video: {
      width: 1920,
      height: 1080,
    },
  }).then(stream => {

    const options = {
      /**
       * videoBitsPerSecond: 视频比特率，默认 2.5 Mbps => 2500000
       * 360p => 1 Mbps
       * 480p => 2.5 Mbps
       * 720p => 5 Mbps
       * 1080p => 8 Mbps
       * 1440p => 16 Mbps
       * 2160p => 35 ~ 45 Mbps
       */
      videoBitsPerSecond : 8000000,
      mimeType : 'video/webm'
    }

    // https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder
    recorder.value = new MediaRecorder(stream, options)
    console.log(recorder.value)
    recorder.value.ondataavailable = onRecordData
    recorder.value.onstop = onRecordStop

    return stream
  }).catch(err => {
    console.log('error: ', err.message)
  })

  localVideo.value.srcObject = localStream
  // 本地视频流接入的同时开始录制。除了开始和停止，还有暂停和继续方法，此处未实现
  recorder.value.start()
}

const onRecordData = (evt) => {
  chunks.value.push(evt.data)

  // 为了避免单次视频录制的 size 过大，可以在此方法监控 chunks 的大小，分段进行保存
  if(true /* 判断大小 */) {
    // save to local and clear chunks for next operation
  }
}

/**
 * About URL.createObjectURL, check this link for more: https://developer.mozilla.org/zh-CN/docs/Web/API/File/Using_files_from_web_applications#%E4%BD%BF%E7%94%A8%E5%AF%B9%E8%B1%A1_url
 */
const onRecordStop = (evt) => {
  let blob = new Blob(chunks.value, {type: 'video/webm'})
  let videoURL = URL.createObjectURL(blob)

  // download
  videoDownloadURL.value = videoURL

  // replay
  replayVideo.value.onloadeddata = onReplayLoadedData
  replayVideo.value.src = videoURL
  // console.log(replayVideo)

  chunks.value = []
}

const onReplayLoadedData = (objectURL) => {
  // 视频加载完成后释放对象 URL
  console.log('onReplayLoadedData ', objectURL)
  URL.revokeObjectURL(objectURL)
}

const onStop = () => {
  recorder.value.stop()
}

</script>

<template>
  <div id="screen-record" class="space-y-2">
    <div>
      <h1 class="bg-red-100 text-3xl text-center">Screen Record</h1>
    </div>

    <div class="flex justify-center items-center space-x-2">
      <div class="btn btn-primary" @click="initVideoSrc">ScreenCapture</div>
      <div class="btn btn-danger" @click="onStop">Stop</div>
    </div>

    <div class="flex justify-around">
      <div>
        <p class="text-xl">Local Video</p>
        <video ref="localVideo" controls autoplay muted />
      </div>

      <div>
        <p class="text-xl">Replay Video</p>
        <video ref="replayVideo" controls autoplay muted />
      </div>
    </div>

    <div class="flex justify-center items-center">
      <a :download="videoDownloadURL" :href="videoDownloadURL"> Click here to download: {{ videoDownloadURL ? videoDownloadURL.substring(videoDownloadURL.lastIndexOf('/') + 1) + '.webm' : ''}}</a>
    </div>
  </div>
</template>

<style scoped>
.btn {
  @apply rounded p-2 shadow text-md cursor-default
}

.btn-primary {
  @apply bg-blue-500 text-white
}

.btn-danger {
  @apply bg-red-500 text-white
}
</style>