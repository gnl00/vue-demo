import axios from "axios";

const config = {
    baseURL: '/web',
    timeout: 10000
}

// 创建实例
const instance = axios.create(config)

// 请求拦截器
instance.interceptors.request.use(
  request => {
    // 进行 token 检查或者必须参数检查

    // 做完处理之后需要 return 请求
    return request
  }
)

// 响应拦截器
instance.interceptors.response.use(
  response => {
    // 检查响应数据
  if (response != null) {
      return response
  }
}, error => {
    return Promise.reject(error.response.data)
  })

export default instance