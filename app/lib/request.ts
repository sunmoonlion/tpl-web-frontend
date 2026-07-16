import axios from 'axios'
import { clientEnv } from '@/env/client'

const request = axios.create({
  baseURL: clientEnv.NEXT_PUBLIC_API_URL,
  timeout: 15000,
  withCredentials: true,
})

request.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    if (status === 401) {
      window.location.href = '/zh-CN/login'
    }
    return Promise.reject(error)
  },
)

export default request
