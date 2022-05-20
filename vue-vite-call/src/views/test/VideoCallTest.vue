<script setup>
// font download
// https://www.nerdfonts.com/font-downloads

import {ref} from "vue";

let uid = ref('')

let localStream = ref(null)
let remoteStream = ref(null)
let peerStart = ref(false)

// =============================================================================================
let webSocket = null
let webSocketURLPrefix = 'ws://localhost:8866/call/'

const websocketInit = () => {
  webSocket.onopen = (evt) => {
    console.log('websocket opened ', evt)
  }

  webSocket.onclose = (evt) => {
    console.log('websocket closed ', evt)
  }

  webSocket.onerror = (evt) => {
    console.log('websocket error:  ', evt)
  }

  webSocket.onmessage = (evt) => {
    console.log('websocket onmessage:  ', evt)
    if (evt && evt.data) {
      messageTypeHandler(JSON.parse(evt.data))
    }

  }
}

const messageTypeHandler = (evt) => {
  const type = evt.type
  switch (type) {
    case 'offer':
      console.log('received OFFER')
      onOffer(evt)
      break
    case 'answer':
      console.log('received ANSWER')
      if (peerStart.value) {
        onAnswer(evt)
      }
      break
    case 'candidate':
      console.log('received ICE CANDIDATE')
      if (peerStart.value) {
        onCandidate(evt)
      }
      break
    case 'bye':
      console.log('received BYE, DISCONNECTED')
      if (peerStart.value) {
        stop()
      }
      break
    default:
        break
  }
}

// =============================================================================================
const onStreamStart = () => {
  // websocket connect and init
  webSocket = new WebSocket(webSocketURLPrefix + uid.value)
  websocketInit()

  navigator.mediaDevices.getUserMedia({
    audio: true,
    video: {
      width: 200,
      height: 200
    }
  }).then(stream => {
    if(stream) {
      // console.log(stream)
      localStream.value.srcObject = stream
      // console.log(localStream)
      // console.log(localStream.value.srcObject.getTracks())
      // localStream.value.play()
      // console.log(localStream)
    }
  }).catch(err => {
    console.log(err)
  })
}

const onStreamStop = () => {
  localStream.value = null
  localStream.value.srcObject = null
}

// =============================================================================================
let peerConnection = null
// =============================================================================================
const sendCandidate = (candidate) => {
  console.log('sendCandidate ', candidate)
  const text = JSON.stringify(candidate)
  // 4
  webSocket.send(text)
}

const onCandidate = (evt) => {
  const candidate = new RTCIceCandidate({
    sdpMLineIndex: evt.sdpMLineIndex,
    sdpMid: evt.sdpMid,
    candidate: evt.candidate
  })
  console.log('onCandidate CANDIDATE: ', candidate)
  peerConnection.addIceCandidate(candidate)

  console.log(peerConnection)
}

const PeerConnection = () => {
  let peer = null

  const config = {
    'iceServers': []
  }

  try {
    // About RTCPeerConnection, check this link: https://developer.mozilla.org/zh-CN/docs/Web/API/RTCPeerConnection
    peer = new RTCPeerConnection(config)
  } catch (e) {
    console.log('connect establish failed: ', e.message)
  }

  // 调用 setLocalDescription 方法后，RTCPeerConnection 开始收集候选人（ICE 信息）
  peer.onicecandidate = (evt) => {
    console.log('onicecandidate ', evt)
    let candidate = null
    if ((candidate = evt.candidate)) {
      sendCandidate({
        type: 'candidate',
        sdpMLineIndex: candidate.sdpMLineIndex,
        sdpMid: candidate.sdpMid,
        candidate: candidate.candidate
      })
    }
  }

  // 1
  console.log('init PeerConnection ', peer)

  // 添加本地 音/视频流对象
  // peer.addStream(localStream.value)
  // addStream 方法已经被删除 使用 addTrack 代替。
  // check this link for more about addStream: https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/addStream
  localStream.value.srcObject.getTracks().forEach(track => {
    peer.addTrack(track, localStream.value.srcObject)
  })

  // 添加远程 音/视频流对象
  peer.ontrack = (evt) => {
    console.log('ontrack ', evt)
    console.log('添加远程视频流')
    remoteStream.value.srcObject = evt.streams[0]
  }

  // const onRemoteTrackAdd = (evt) => {
  //   remoteStream.value.srcObject = evt.stream
  // }

  // 移除远程 音/视频流对象
  // const onRemoteTrackRemove = (evt) => {
  //   console.log('移除远程视频流 ', evt)
  //   remoteStream.value.src = null
  // }

  // peer.addEventListener('addTrack', onRemoteTrackAdd, false)
  // peer.removeEventListener('removeTrack', onRemoteTrackRemove, false)

  return peer
}

// =============================================================================================
const rtcOption = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
}

// 创建 offer
const createOffer = () => {
  // 0
  console.log('create OFFER')
  peerConnection = PeerConnection()
  peerConnection.createOffer(rtcOption).then(evt => {
    peerConnection.setLocalDescription(evt)
    console.log('send OFFER')
    sendSDP(evt)

  }).catch(err => {
    console.log('offer create failed: ', err.message)
  })
}

// 发送 SDP
const sendSDP = (evt) => {
  const text = JSON.stringify(evt)
  webSocket.send(text)
}

// =============================================================================================
const onOffer = (evt) => {
  console.log('set OFFER')
  setOffer(evt)
  sendAnswer()

  peerStart.value = true
}

const setOffer = (evt) => {
  if (!peerConnection) {
    peerConnection = PeerConnection()
    peerConnection.setRemoteDescription(new RTCSessionDescription(evt))
  }
  console.log(peerConnection)
}

const sendAnswer = () => {
  console.log('create and send ANSWER')
  if (peerConnection) {
    peerConnection.createAnswer(rtcOption).then(sdp => {
      peerConnection.setLocalDescription(sdp)
      sendSDP(sdp)
    }).catch(err => {
      console.log('create answer failed ', err.message)
    })
  } else {
    console.log('peerConnection not exist')
  }
}

const onAnswer = (evt) => {
  console.log('onAnswer ', evt)
  setAnswer(evt)
}

const setAnswer = (evt) => {
  console.log('set ANSWER')
  if (peerConnection) {
    peerConnection.setRemoteDescription(new RTCSessionDescription(evt))
  }
  console.log(peerConnection)
}

// =============================================================================================
const connect = () => {
  console.log('start connect')
  if (!peerStart.value && localStream.value) {
    createOffer()
    peerStart.value = true
  }
}

const stop = () => {
  console.log('stop connect')
  peerConnection.close()
  peerConnection = null

  peerStart.value = false
}

</script>

<template>
  <div class="space-y-4">
    <div class="bg-green-300">
      <h1 class="text-3xl text-center">VoiceCall-Test</h1>
    </div>

    <div class="flex justify-center items-center">
      <input type="text" placeholder="input here" class="outline-none border-gray-200 border-2 rounded" v-model="uid" />
    </div>

    <div class="flex justify-center items-center space-x-2">
      <var-button type="primary" @click="onStreamStart">StreamStart</var-button>
      <var-button type="danger" @click="onStreamStop">StreamStop</var-button>
    </div>

    <div class="flex justify-center items-center space-x-2">
      <var-button type="info" @click="connect">RTC Connect</var-button>
      <var-button type="warning" @click="stop">RTC Disconnect</var-button>
    </div>

    <div class="flex justify-center items-center space-x-4">
      <div class="flex flex-col justify-center items-center">
        <p class="text-center">Local Area</p>
        <video ref="localStream" controls />
      </div>

      <div class="flex flex-col justify-center items-center">
        <p class="text-center">Remote Area</p>
        <video ref="remoteStream" controls />
      </div>
    </div>

  </div>
</template>

<style scoped></style>