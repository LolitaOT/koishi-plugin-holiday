import axios from 'axios';
const service = axios.create({
  baseURL: 'http://timor.tech/api/holiday',
  timeout: 1000 * 60 
})

// request interceptor
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response.data
    return res
  },
  error => {
    return Promise.reject(error)
  }
)

export = service
