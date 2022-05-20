import instance from "./axios";

export const joinRoomReq = (roomId, uid) => {
  return instance({
    method: 'post',
    url: '/room/join?roomId=' +roomId + '&uid=' + uid
  })
}

export const getRoomMembersReq = (roomId, uid) => {
  return instance({
    method: 'get',
    url: '/room/members?roomId=' + roomId + '&uid=' + uid
  })
}
