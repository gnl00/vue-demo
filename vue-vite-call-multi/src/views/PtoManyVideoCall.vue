<script setup>
import { ref } from "vue";
import {getRoomMembersReq, joinRoomReq} from "../network/request";

// 音频/视频流配置
const constraints = {
  audio: false,
  video: {
    height: 1920,
    width: 1080
  }
}

let curUid = ref(null)
// 房间号/群聊号，在进行 websocket 连接前需要确定好，因为需要使用它作为 websocket 的 path 参数
let roomId = ref(null)

// 默认获取屏幕流
let localVideoSrc = ref('screen')
let localVideo = ref(null)
let localStream = ref(null)

let remoteStreams = []

// 只保存比当前客户端早加入房间的其他客户端
let members = []
let localSDP = null
let pcMap = new Map()

// 视频展示区域
let videoArea = ref(null)

let webSocket = null
// host:port/ptoMany/{roomId}/{uid}
let webSocketURL = 'ws://localhost:8866/ptoMany/'

const initWebSocket = (roomId, uid) => {
  console.log(`initWebSocket, roomId: ${roomId} and uid: ${uid}`)
  if (webSocket) {
    return
  }

  webSocket = new WebSocket(webSocketURL + roomId + '/' + uid)

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
  // 接收到的 sdp data 对象内容 {src: '', type: '', sdp: {type: '', sdp: ''}}
  // 接收到的 candidate data 对象内容 {src: '', type: '', candidate: {}}
  // src 是远程发起 createOffer 一方的 ID，用来维护对应的 RTCPeerConnection
  switch (data.type) {
    case 'offer':
      console.log('receive OFFER sdp')
      // 如果需要接听弹窗，可以在此时弹出
      onOffer(data)
      break
    case 'answer':
      console.log('receive ANSWER sdp')
      if (pcMap && pcMap.get(data.src)) {
        onAnswer(data)
      }
      break
    case 'candidate':
      console.log('receive CANDIDATE')
      if (pcMap && pcMap.get(data.src)) {
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

  let stream = null
  if (localVideoSrc.value === 'camera') {
    // 使用摄像头获取视频流
    stream = await navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => stream)
        .catch(err => {
          console.log('error: ', err.message)
        })
  } else {
    // 获取屏幕视频流
    stream = await navigator.mediaDevices.getDisplayMedia(constraints)
        .then(stream => stream)
        .catch(err => {
          console.log('error: ', err.message)
        })
  }

  if (stream) {
    console.log(stream)

    stream.oninactive = onStreamInactive
    localStream.value = stream
    localVideo.value.srcObject = stream
    curUid.value = stream.id
  }
}

const onStreamInactive = (evt) => {
  // 关闭流对象，进行善后工作
  console.log('stream closed ', evt)
}

const join = async () => {
  if (!localStream.value) {
    alert('Please open stream first')
    return
  }

  if (!roomId.value || roomId.value === 0) {
    alert('Please input room ID')
    return
  }

  let curRoomId = roomId.value
  let curUid = localStream.value.id

  // 初始化 websocket
  initWebSocket(curRoomId, curUid)

  // create or join room
  const joinResult = await joinRoom(curRoomId, curUid)
  if (!joinResult) {
    alert(`Join room： ${curRoomId} failed, please retry`)
  }

  // get and set members
  members = await getRoomMembers(curRoomId, curUid)
}

const initPeerConnection = (id) => {
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
    peer.id = id
  } catch (e) {
    console.log('initPeerConnection catch ERROR: ', e.message)
  }

  // RTCCandidate check this link: https://developer.mozilla.org/en-US/docs/Web/API/RTCIceCandidate
  // 收集 ice candidate
  peer.onicecandidate = (event) => {
    let candidate = null
    if ((candidate = event.candidate)) {
      // Send the candidate to the remote peer
      sendCandidate(candidate, id)
    } else {
      // All ICE candidates have been sent
    }
  }

  // add local stream
  localStream.value.getTracks().forEach(track => {
    peer.addTrack(track, localStream.value)
  })

  // 监听是否有远程媒体流接入，如果有则设置到 remoteVideoStreams
  peer.ontrack = (evt) => {
    console.log('detected remote tracks ', evt)

    createVideoElm(id, evt.streams[0])

    remoteStreams.push(evt.streams[0])
    console.log(remoteStreams)
  }

  return peer
}

// 发送 ice candidate
const sendCandidate = (candidate, target) => {
  console.log('sendCandidate to: ', target)
  // 将 candidate 消息包装起来，以便在 messageHandler 中对 offerSDP、answerSDP、candidate 这三种消息做区分处理
  let candidateWrap = {
    src: curUid.value,
    target,
    type: 'candidate',
    candidate
  }
  let jsonStr = JSON.stringify(candidateWrap)
  webSocket.send(jsonStr)
}

// 接收到 ice candidate，添加到对应的 RTCPeerConnection
const onCandidate = (data) => {
  console.log('onCandidate')

  const {src: target, candidate} = data
  let pc = pcMap.get(target)
  pc.addIceCandidate(candidate)
}

const sdpOptions = {
  offerToReceiveAudio: true,
  offerToReceiveVideo: true
}

// 对房间内所有的客户端发送 sdp，用于最后一个客户端， createOffer 之后
const sendSDP = (sdp) => {
  console.log('sendSDP')
  let wrap = {
    src: curUid.value,
    type: sdp.type,
    sdp
  }
  webSocket.send(JSON.stringify(wrap))
}

// 给对应的客户端发送 answer sdp
const sendSDPTo = (sdp, target) => {
  let wrap = {
    src: curUid.value,
    target: target,
    type: sdp.type,
    sdp
  }
  webSocket.send(JSON.stringify(wrap))
}

const createOffer = (pc) => {
  // 为每一个 RTCPeerConnection 创建并设置 offer sdp
  console.log('create offer sdp for ', pc.id)
  pc.createOffer(sdpOptions).then(offerSDP => {
    // offerSDP 对象的内容为 {type: 'offer', sdp: {}, ...}
    console.log(offerSDP)
    // save local sdp
    localSDP = offerSDP
    console.log('set local offer sdp')
    pc.setLocalDescription(offerSDP)
    console.log('send offer sdp')
    sendSDPTo(offerSDP, pc.id)
  }).catch(err => {
    console.log('createOffer ERROR: ', err.message)
  })
}

const onOffer = (data) => {
  console.log('onOffer')

  const { src: target, sdp } = data
  // 接收到房间中最后加入客户端的 Offer sdp
  let pc = null
  if (pcMap.has(target)) {
    pc = pcMap.get(target)
  } else {
    pc = initPeerConnection(target)
    // set RTCPeerConnection to Map
    pcMap.set(target, pc)
  }

  // set remote offer sdp
  console.log('set remote offer sdp ')
  console.log(sdp)
  pc.setRemoteDescription(new RTCSessionDescription(sdp))

  // create answer sdp
  // 创建对应的 answer sdp
  createAnswer(target)

  // 与为建立 RTCPeerConnection 的客户端创建实例，并进行连接
  // Establish connection with other client who has not
  members.forEach(pcId => {
    if (!pcMap.has(pcId)) {
      let pc = initPeerConnection(pcId)
      createOffer(pc)
      pcMap.set(pcId, pc)
    }
  })

}

const createAnswer = (target) => {
  console.log('createAnswer')

  let pc = pcMap.get(target)
  pc.createAnswer(sdpOptions).then(answerSDP => {
    console.log('set local answer sdp')
    pc.setLocalDescription(answerSDP)
    console.log('send answer sdp')
    sendSDPTo(answerSDP, target)
  }).catch(err => {
    console.log('createOffer ERROR: ', err.message)
  })
}

const onAnswer = (data) => {
  console.log('onAnswer')
  console.log(data)

  const {src: target, sdp} = data

  // 收到 answer sdp，设置到对应的 RTCPeerConnection
  let pc = pcMap.get(target)
  // set remote answer sdp to the right RTCPeerConnection
  console.log('set remote answer sdp')
  pc.setRemoteDescription(new RTCSessionDescription(sdp))
}

const connect = async () => {
  if (!roomId.value || roomId.value === 0) {
    alert('Please join a room before connect')
    return
  }

  console.log('connect')

  // check room members
  // 检查当前房间中的人数，若存在其他 member 则 createOffer
  if (members && members.length !== 0) {
    // 为每一个客户端初始化一个对应的 RTCPeerConnection
    members.forEach(id => {
      let pc = initPeerConnection(id)

      // create offer and send to every member in the same room
      createOffer(pc)

      pcMap.set(id, pc)
    })
  }
}

const disconnect = () => {
  console.log('disconnect')

  // localVideo.value = null
  // remoteStreams = []
  // pcMap.forEach(pc => pc.close())
}

const joinRoom = (roomId, uid) => {
  console.log(`joinRoom roomId: ${roomId}, uid: ${uid}`)

  const joinResult = joinRoomReq(roomId, uid).then(res => {
    return res
  }).catch(err => {
    console.log('joinRoom ERROR: ', err.message)
  })

  return joinResult
}

const getRoomMembers = (roomId, uid) => {
  console.log(`getRoomMembers roomId: ${roomId}`)

  const members = getRoomMembersReq(roomId, uid).then(res => {
    return res
  }).catch(err => {
    console.log('getRoomMembers ERROR: ', err.message)
  })
  return members
}

// 当接收到远程视频流的时候，创建一个新的 <video> 并显示
const createVideoElm = (elId, stream) => {

  const div = document.createElement('div')

  const title = document.createElement('p')
  title.className = 'text-xl'
  title.innerText = elId

  const video = document.createElement('video')
  video.id = elId
  video.srcObject = stream
  video.muted = true
  video.autoplay = true

  div.appendChild(title)
  div.appendChild(video)

  console.log('div tag ', div)

  videoArea.value.appendChild(div)
}

</script>

<template>
  <div id="multi-call" class="space-y-2 mb-2">
    <div class="bg-blue-100">
      <h1 class="text-3xl text-center">P to Many Call</h1>
    </div>

    <div class="bg-pink-100 space-x-2 pl-1 pr-1 flex justify-center items-center">
      <span><strong>Step1</strong>: 选择视频流来源（屏幕 or 摄像头），OpenStream；</span>
      <span><strong>Step2</strong>：输入 roomID，加入房间；</span>
      <span><strong>Step3</strong>：Connect（为了保持连接顺序，需要最后一个加入房间的客户端进行 Connect 操作）。</span>
    </div>

    <div class="flex flex-col justify-center items-center space-y-2">
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
        <input class="outline-none bg-gray-100 p-1" placeholder="Input room ID" @change="evt => { roomId = evt.target.value }" />
        <div class="btn btn-warning" @click="join">Join</div>
      </div>

      <div class="flex justify-center items-center space-x-2">
        <div class="btn btn-success" @click="connect">Connect</div>

        <div class="btn btn-danger" @click="disconnect">Disconnect</div>
      </div>
    </div>

    <div class="bg-yellow-100">
      <p class="text-center text-lg">currentId: {{localStream ? localStream.id : ''}}</p>
      <p class="text-center text-lg">roomId: {{roomId ? roomId : ''}}</p>
    </div>

    <div id="video-area" class="flex justify-around" ref="videoArea">
      <div>
        <p class="text-xl">Local Video</p>
        <video ref="localVideo" muted autoplay controls />
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