<script setup>
// 使用 captureStream() 的时候踩了一个坑，canvas 的高度和宽度不能超过一定值（测试发现是宽高不能超过300），否则 remoteVideo 标签无法播放 remote stream
import {onMounted, ref} from "vue";
import CanvasHelper from "../utils/CanvasHelper";

let canvas = ref(null)

// let localVideo = ref(null)
let localStream = ref(null)

let remoteId = ref(null)
// let remoteVideo = ref(null)

let text = ref(null)

// ===================================================== WebSocket ================================================================

let webSocket = null
// host:port/pTop/{id}
let webSocketURL = 'ws://localhost:8866/pTop/'

const initWebSocket = (id) => {
  console.log(`initWebSocket id: ${id}`)
  if (webSocket) {
    return
  }

  webSocket = new WebSocket(webSocketURL + id)

  webSocket.onopen = () => {
    console.log('websocket opened')
  }

  webSocket.onclose = () => {
    console.log('websocket closed')
  }

  webSocket.onmessage = (evt) => {
    // console.log('websocket receive message ', evt)

    // 根据消息类型进行不同操作
    if (evt.data) {
      messageHandler(JSON.parse(evt.data))
    }
  }
}

const messageHandler = (data) => {
  switch (data.type) {
    case 'offer':
      // console.log('receive OFFER sdp')
      // 如果需要接听弹窗，可以在此时弹出
      onOffer(data)
      break
    case 'answer':
      // console.log('receive ANSWER sdp')
      if (peerConnection) {
        onAnswer(data)
      }
      break
    case 'candidate':
      // console.log('receive CANDIDATE')
      if (peerConnection) {
        onCandidate(data)
      }
      break
    case 'bye':
      // console.log('receive BYE')
      // disconnect()
      break
    default:
      break
  }
}

const openWebSocket = () => {
  initWebSocket(localStream.value.id)
}

// ===================================================== RTCPeerConnection ================================================================

let peerConnection = null
let dataChannel = null
let canvasDataChannel = null

const initPeerConnection = () => {
  let peer = null
  const iceServers = []

  try {
    peer = new RTCPeerConnection({ iceServers } )
  } catch (e) {
    console.log('initPeerConnection catch ERROR: ', e.message)
  }

  peer.onicecandidate = (event) => {
    let candidate = null
    if ((candidate = event.candidate)) {
      // Send the candidate to the remote peer
      sendCandidate(candidate)
    } else {
      // All ICE candidates have been sent
    }
  }

  // 接收由 RTCDateChannel 传输过来的数据
  peer.ondatachannel = evt => {
    console.log(evt)
    if (evt.channel.label === 'messageChannel') {
        dataChannel = evt.channel
        initDataChannel(dataChannel)
    } else if (evt.channel.label === 'canvasChannel') {
      canvasDataChannel = evt.channel
      initCanvasDataChannel(canvasDataChannel)
    }
  }

  // add local stream
  localStream.value.getTracks().forEach(track => {
    peer.addTrack(track, localStream.value)
  })

  peer.ontrack = (evt) => {
    // console.log('detected remote tracks ', evt)
    const stream = evt.streams[0]
    if (stream) {
      // remoteVideo.value.srcObject = stream
    }

  }

  return peer
}

// 发送 ice candidate
const sendCandidate = (candidate) => {
  let wrap = {
    src: localStream.value.id,
    target: remoteId.value,
    type: 'candidate',
    candidate
  }
  let jsonStr = JSON.stringify(wrap)
  webSocket.send(jsonStr)
}

// 接收到 ice candidate，添加到 peerConnection
const onCandidate = (data) => {
  const { candidate } = data
  peerConnection.addIceCandidate(candidate)
}

const initDataChannel = (channel) => {
  channel.onopen = evt => {
    // console.log('dataChannel opened ! ', evt)
  }

  channel.onmessage = evt => {
    console.log('dataChannel receive message: ', evt)
  }
}

const initCanvasDataChannel = (channel) => {
  channel.onopen = evt => {
    // console.log('dataChannel opened ! ', evt)
  }

  channel.onmessage = evt => {
    // console.log('canvas dataChannel receive message: ', evt)
    const struct = {dataType: '', data: {}}
    if (evt.data) {
      const {dataType, data} = JSON.parse(evt.data)

      if (dataType === 'draw') {
        drawCanvas(data)
      } else if (dataType === 'stop') {
        drawStop()
      }
    }
  }
}

const sendSDP = (sdp) => {
  const wrap = {
    src: localStream.value.id,
    target: remoteId.value,
    type: sdp.type,
    sdp,
  }
  const jsonStr = JSON.stringify(wrap)
  webSocket.send(jsonStr)
}

const sdpOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
}

const createOffer = () => {
  peerConnection.createOffer(sdpOptions).then(offerSDP => {
    // console.log(offerSDP)
    peerConnection.setLocalDescription(offerSDP)
    sendSDP(offerSDP)
  }).catch(err => {
    console.log('createOffer ERROR: ', err.message)
  })
}

const onOffer = (data) => {
  if (!peerConnection) {
    peerConnection = initPeerConnection()
  }

  const { src, sdp } = data
  remoteId.value = src
  peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))

  createAnswer()
}

const createAnswer = () => {
  peerConnection.createAnswer(sdpOptions).then(answerSDP => {
    peerConnection.setLocalDescription(answerSDP)
    sendSDP(answerSDP)
  }).catch(err => {
    console.log('createOffer ERROR: ', err.message)
  })
}

const onAnswer = (data) => {
  const { sdp } = data
  peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
}

const connect = async () => {
  peerConnection = initPeerConnection()

  dataChannel = peerConnection.createDataChannel('messageChannel')
  initDataChannel(dataChannel)

  canvasDataChannel = peerConnection.createDataChannel('canvasChannel')
  initCanvasDataChannel(canvasDataChannel)

  createOffer()
}

const sendText = () => {
  if (dataChannel && text.value) {
    dataChannel.send(text.value)
    text.value = ''
  }
}

// ===================================================== Canvas ================================================================
let drawType = ref('line')
let caHelper = null
const initCanvas = (canvas) => {
  caHelper = new CanvasHelper(canvas, { drawCallback, stopCallback })
}

// 绘画时回调，拿到当前绘画数据
// 将 callback 传到 CanvasHelper 中，拿到绘画数据
// 再将数据通过 RTCDataChannel 传输到 remote
const drawCallback = (drawData) => {
  console.log(drawData)

  if (drawData && dataChannel) {
    canvasDataChannel.send(JSON.stringify({dataType: 'draw', data: drawData}))
  }
}

// 绘画停止回调
const stopCallback = () => {
  console.log('stopCallback')

  if (canvasDataChannel) {
    canvasDataChannel.send(JSON.stringify({
      dataType: 'stop',
      data: {}
    }))
  }
}

const drawCanvas = (drawData) => {
  caHelper.remoteDraw({
    drawType: drawData.drawType,
    color: drawData.drawColor,
    lineWidth: drawData.lineWidth,
    points: drawData.points
  })
}

const drawStop = () => {
  caHelper.stop()
}

const drawTypeClick = (type) => {
  drawType.value = type

  // 修改 canvas 样式
  caHelper.change({drawType: drawType.value})
}

const onColorSelectorChange = (evt) => {
  // 修改 canvas 样式
  caHelper.change({drawColor: evt.target.value})
}

const clearCanvas = () => {
  caHelper.clear()
}

const saveCanvas = () => {
  const url = caHelper.save()

  const a = document.createElement('a')
  a.download = 'canvas-' + new Date().getTime()
  a.href = url
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// ===================================================== LifeCircle ================================================================
onMounted(() => {
  initCanvas(canvas.value)
  let canvasStream = canvas.value.captureStream(25)
  // console.log('got canvas stream ', canvasStream)
  localStream.value = canvasStream
})
</script>

<template>
  <div class="flex flex-col space-y-2">
    <div class="bg-green-100">
      <h1 class="text-center text-3xl">Share White Board</h1>
    </div>

    <div class="bg-pink-100">
      <h3 class="text-center text-lg">
        Step 1: Click Establish connect with server
        Step 2: Enter remoteId
        Step 3: Click Connect Remote
      </h3>
    </div>

    <div class="flex justify-center items-center">
      {{localStream ? localStream.id : ''}}
    </div>

    <div class="flex justify-center items-center">
      <div class="btn btn-warning" @click="openWebSocket">Establish connect with server</div>
    </div>

    <div class="flex justify-center items-center space-x-2">
      <input class="outline-none bg-gray-100 p-1"  placeholder="RemoteId" :value="remoteId || '' " @change="evt => remoteId = evt.target.value"/>
      <div class="btn btn-primary" @click="connect">Connect Remote</div>
    </div>

    <div class="flex justify-center items-center space-x-2">
      <input class="outline-none bg-gray-100 p-1" placeholder="Input text here" :value="text" @change="evt => text = evt.target.value" />
      <div class="btn btn-success" @click="sendText">Send</div>
    </div>

    <div class="flex justify-around items-center">

      <div>
        <p class="text-xl">Canvas</p>
        <div class="flex justify-start items-center space-x-2">
          <select class="outline-none" @change="onColorSelectorChange" value="black">
            <option value="black" class="bg-black text-black" label="黑色" />
            <option value="white" class="bg-white text-white" label="白色" />
            <option value="red" class="bg-red-500 text-red-500" label="红色" />
            <option value="blue" class="bg-blue-500 text-blue-500" label="蓝色" />
            <option value="green" class="bg-green-500 text-green-500" label="绿色" />
          </select>
          <div :class="['btn', drawType === 'line' ? 'choose-ring' : '']" @click="evt => {drawTypeClick('line')}" >画笔</div>
          <div :class="['btn btn-success', drawType === 'rect' ? 'choose-ring' : '']" @click="evt => {drawTypeClick('rect')}" >矩形</div>
          <div :class="['btn btn-warning', drawType === 'arc' ? 'choose-ring' : '']" @click="evt => {drawTypeClick('arc')}" >圆形</div>
          <div class="btn btn-danger" @click="clearCanvas">清空</div>
          <div class="btn btn-primary" @click="saveCanvas">保存</div>
        </div>
        <canvas ref="canvas" width="1000" height="520" class="bg-gray-100"></canvas>
      </div>

<!--      <div>-->
<!--        <p>Local</p>-->
<!--        <video ref="localVideo" autoplay muted></video>-->
<!--      </div>-->

<!--      <div>-->
<!--        <p>Remote</p>-->
<!--        <video ref="remoteVideo" controls autoplay muted></video>-->
<!--      </div>-->

    </div>

  </div>
</template>

<style scoped>
.choose-ring {
  @apply ring-3 ring-blue-500
}
</style>