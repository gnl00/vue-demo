<script setup>
/**
 * 1、获取视频流
 * 2、创建 RTCPeerConnection
 * 3、发起方：发送 Offer SDP，在发送 Offer SDP 的同时就开始收集 ice candidate
 * 4、接收方：接收 Offer SDP，并发送 Answer SDP
 * 5、发起方：接收 Answer SDP，收集 ice candidate 并发送
 * 6、双方确定最短路径的 ice candidate，将其作为通信连接使用
 * 7、开始通信
 */

import { ref } from "vue";

// 音频/视频流配置
const constraints = {
  audio: false,
  video: {
    height: 1920,
    width: 1080
  }
}

// 默认获取屏幕流
let localVideoSrc = ref('screen')
let localVideo = ref(null)
let localStream = ref(null)

let remoteId = ref(null)
let remoteVideo = ref(null)

let text = ref(null)

let peerConnection = null

// https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection/createDataChannel#rtcdatachannelinit_dictionary
// 数据传输通道 RTCDateChannel
// 一般只由数据发送方创建（createOffer 方），其他客户端只需要实现 ondatachannel 方法来进行监听即可
let dataChannel = null
// RTCDateChannel 和 websocket 相似，都有 onopen、onclose、onmessage 等方法

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
    console.log('websocket receive message ', evt)

    // 判断消息类型
    // 根据消息类型进行不同操作
    if (evt.data) {
      messageHandler(JSON.parse(evt.data))
    }
  }
}

const messageHandler = (data) => {
  switch (data.type) {
    case 'offer':
      console.log('receive OFFER sdp')
      // 如果需要接听弹窗，可以在此时弹出
      onOffer(data)
      break
    case 'answer':
      console.log('receive ANSWER sdp')
      if (peerConnection) {
        onAnswer(data)
      }
      break
    case 'candidate':
      console.log('receive CANDIDATE')
      if (peerConnection) {
        onCandidate(data)
      }
      break
    case 'bye':
      console.log('receive BYE')
      disconnect()
      break
    default:
      break
  }
}

const videoSrcClick = (evt) => {
  let radios = document.getElementsByClassName('radio')
  let currentRadio = evt.target.children[0]
  for (let i = 0; i < radios.length; i++) {
    let item = radios[i].children[0]
    if (item === currentRadio) {
      item.checked = true
      localVideoSrc.value = item.value
    } else {
      item.checked = false
    }
  }
}

const openStream = async () => {
  console.log('stream source: ', localVideoSrc.value)

  if (localVideoSrc.value === 'camera') {
    // 使用摄像头获取视频流
    await navigator.mediaDevices.getUserMedia(constraints).then(stream => {
      localStream.value = stream
      localVideo.value.srcObject = stream
    }).catch(err => {
      console.log('error: ', err.message)
    })
  } else {
    // 获取屏幕视频流
    await navigator.mediaDevices.getDisplayMedia(constraints).then(stream => {
      localStream.value = stream
      localVideo.value.srcObject = stream
    }).catch(err => {
      console.log('error: ', err.message)
    })
  }

  if (localStream.value) {
    initWebSocket(localStream.value.id)
  }
}

const initPeerConnection = () => {
  console.log('initPeerConnection')

  let peer = null
  const iceServers = []

  try {
    // Check link: https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection
    // 一个基本的 RTCPeerConnection 使用需要协调本地机器以及远端机器的连接，它可以通过在两台机器间生成 Session Description 的数据交换协议来实现
    // 呼叫方发送一个 offer sdp，被呼叫方发出一个 answer sdp 来回答请求
    // 双方最开始的时候都要建立他们各自的 RTCPeerConnection 对象
    peer = new RTCPeerConnection({
      iceServers
    })
  } catch (e) {
    console.log('initPeerConnection catch ERROR: ', e.message)
  }

  // RTCCandidate check this link: https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate
  // 收集 ice candidate
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
    if (!dataChannel) {
      console.log('ondatachannel ', evt)
      dataChannel = evt.channel
      initDataChannel(dataChannel)
    }
  }

  // add local stream
  localStream.value.getTracks().forEach(track => {
    peer.addTrack(track, localStream.value)
  })

  // 监听是否有远程媒体流接入，如果有则设置到 remoteVideoStreams
  peer.ontrack = (evt) => {
    console.log('detected remote tracks ', evt)
    remoteVideo.value.srcObject = evt.streams[0]
    // createVideoElm(evt, evt.streams[0])
  }

  return peer
}

// 发送 ice candidate
const sendCandidate = (candidate) => {
  console.log('sendCandidate ', candidate)
  // 将 candidate 消息包装起来，以便在 messageHandler 中对 offerSDP、answerSDP、candidate 这三种消息做区分处理
  let candidateWrap = {
    src: localStream.value.id,
    target: remoteId.value,
    type: 'candidate',
    candidate
  }
  let jsonStr = JSON.stringify(candidateWrap)
  webSocket.send(jsonStr)
}

// 接收到 ice candidate，添加到 peerConnection
const onCandidate = (data) => {
  console.log('onCandidate')
  const { candidate } = data
  peerConnection.addIceCandidate(candidate)
}

const sdpOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
}

const createOffer = () => {
  console.log('create offer sdp')
  peerConnection.createOffer(sdpOptions).then(offerSDP => {
    // offerSDP 对象的内容为 {type: 'offer', sdp: {}, ...}
    console.log(offerSDP)
    console.log('set local offer sdp')
    peerConnection.setLocalDescription(offerSDP)
    console.log('send offer sdp')
    sendSDP(offerSDP)
  }).catch(err => {
    console.log('createOffer ERROR: ', err.message)
  })
}

const sendSDP = (sdp) => {
  console.log('sendSDP')
  const wrap = {
    src: localStream.value.id,
    target: remoteId.value,
    type: sdp.type,
    sdp,
  }
  const jsonStr = JSON.stringify(wrap)
  webSocket.send(jsonStr)
}

const onOffer = (data) => {
  console.log('onOffer')
  // 检查 peerConnection 是否已初始化
  if (!peerConnection) {
    peerConnection = initPeerConnection()
  }

  const { src, sdp } = data

  remoteId.value = src

  // set remote offer sdp
  console.log('set remote offer sdp ')
  console.log(sdp)
  peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))

  // create answer sdp
  createAnswer()
}

const createAnswer = () => {
  console.log('createAnswer')
  peerConnection.createAnswer(sdpOptions).then(answerSDP => {
    console.log('set local answer sdp')
    peerConnection.setLocalDescription(answerSDP)
    console.log('send answer sdp')
    sendSDP(answerSDP)
  }).catch(err => {
    console.log('createOffer ERROR: ', err.message)
  })
}

const onAnswer = (data) => {
  console.log('onAnswer')

  const { sdp } = data
  // set remote answer sdp
  console.log('set remote answer sdp')
  peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
}

const connect = () => {
  if (!remoteId.value) {
    alert('Please input remote id first')
    return
  }

  // create and send offer sdp
  console.log('connect')
  peerConnection = initPeerConnection()

  // RTCDataChannel 创建需要在 createOffer 之前
  dataChannel = peerConnection.createDataChannel('messageChannel')
  initDataChannel(dataChannel)

  createOffer()
}

const disconnect = () => {
  console.log('disconnect')

  localVideo.value = null
  remoteVideo.value = null
  remoteId.value = null
  peerConnection.close()
}

const initDataChannel = (channel) => {
  channel.onopen = evt => {
    console.log('dataChannel opened ! ', evt)
  }

  channel.onmessage = evt => {
    console.log('dataChannel receive message: ', evt)
  }
}

const sendText = () => {
  if (dataChannel && text.value) {
    dataChannel.send(text.value)
    text.value = ''
  }
}

</script>

<template>
  <div id="multi-call" class="space-y-2 mb-2">
    <div class="bg-blue-100">
      <h1 class="text-3xl text-center">P to P Call</h1>
    </div>

    <div class="flex justify-center items-center space-x-2">
      <div class="flex flex-col space-y-2">
        <div class="radio" @click="videoSrcClick">
          camera <input type="radio" disabled value="camera" @click.stop />
        </div>
        <div class="radio" @click="videoSrcClick">
          screen <input type="radio" disabled value="screen" checked @click.stop />
        </div>
      </div>

      <div class="btn btn-primary" @click="openStream">Open Stream</div>
    </div>

    <div class="flex justify-center items-center space-x-2">

      <input class="outline-none bg-gray-100 p-1" placeholder="RemoteID" :value="remoteId || ''" @change="evt => remoteId = evt.target.value" />

      <div class="btn btn-warning" @click="connect">Connect</div>

      <div class="btn btn-danger" @click="disconnect">Disconnect</div>
    </div>

    <div>
      <p class="text-center text-lg">currentId: {{localStream ? localStream.id : ''}}</p>
    </div>

    <div class="flex justify-center items-center space-x-2">
      <input class="outline-none bg-gray-100 p-1" :value="text || ''" @change="evt => text = evt.target.value" placeholder="Input text to send" />
      <div class="btn btn-success" @click="sendText">Send</div>
    </div>

    <div id="video-area" class="flex justify-around">
      <div>
        <p class="text-xl">Local Video</p>
        <video ref="localVideo" controls muted autoplay />
      </div>

      <div>
        <p class="text-xl">Remote Video</p>
        <video ref="remoteVideo" controls muted autoplay />
      </div>

    </div>

  </div>
</template>

<style scoped>
.btn {
  @apply rounded p-2 shadow text-md cursor-default w-auto h-auto
}

.btn-primary {
  @apply bg-blue-500 text-white
}

.btn-success {
  @apply bg-green-500 text-white
}

.btn-warning {
  @apply bg-yellow-500 text-white
}

.btn-danger {
  @apply bg-red-500 text-white
}

.radio {
  @apply bg-gray-100 p-1 rounded cursor-default shadow
}
</style>