import axios from "axios";

const config = {
  baseURL: '/api',
  timeout: 50000
}

const instance = axios.create(config)

instance.interceptors.request.use(req => req /* check request data here*/ )
instance.interceptors.response.use(resp => resp.data /* check response result here*/ )

export default instance