import instance from "./axios";

export const getBasicCategory = (timestamp) => {
  return instance({
    method: 'GET',
    url: '/getBasicCategory?_t=' + timestamp,
  })
}

export const getChild = (catalogIndexCode, timestamp) => {
  return instance({
    method: 'GET',
    url: '/getChild?catalogIndexCode=' + catalogIndexCode + '&_t=' + timestamp,
  })
}

export const getDevice = ({pageNum, regionIndexCode, catalogIndexCode, timestamp}) => {
  return instance({
    method: 'GET',
    url: 'getDevice?pageNum=' + pageNum + "&regionIndexCode=" + regionIndexCode + "&catalogIndexCode=" + catalogIndexCode + "&_t=" + timestamp
  })
}

export const getCamera = ({pageNum, regionIndexCode, catalogIndexCode, timestamp}) => {
  return instance({
    method: 'GET',
    url: 'getCamera?pageNum=' + pageNum + "&regionIndexCode=" + regionIndexCode + "&catalogIndexCode=" + catalogIndexCode + "&_t=" + timestamp
  })
}

export default {
  getBasicCategory,
  getChild,
  getDevice,
  getCamera
}