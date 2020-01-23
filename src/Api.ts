import Axios, { AxiosRequestConfig } from 'axios'
import store from './store'

const { protocol } = window.location

const Api = {
  gs: {
    get: async (path: string, config?: AxiosRequestConfig) => {
      const host = await gsHost()
      return Axios.get(`${protocol}//${host + path}`, config)
    },
  },
  ws: {
    get: (path: string, config?: AxiosRequestConfig) => {
      return Axios.get(`${protocol}//${wsHost() + path}`, config)
    },
    post: (path: string, data: any, config?: AxiosRequestConfig) => {
      return Axios.post(`${protocol}//${wsHost() + path}`, data, config)
    },
    patch: (path: string, data: any, config?: AxiosRequestConfig) => {
      return Axios.patch(`${protocol}//${wsHost() + path}`, data, config)
    },
  },
}

const wsHost = () => {
  switch (window.location.hostname) {
    case 'localhost':
      return 'localhost:5000'
    case 'dev.hexarena.io':
      return 'us-ws-0.hexarena.io'
    case 'hexarena.io':
    case 'hex-gc-live.now.sh':
      return 'us-ws-1.hexarena.io'
    default:
      return `${window.location.hostname}:5000`
  }
}

export const gsHost = async () => {
  if (store.gsHost) return store.gsHost

  switch (window.location.hostname) {
    case 'localhost': {
      const hostname = 'localhost:8000'
      store.gsHost = hostname
      return hostname
    }
    case 'dev.hexarena.io': {
      const hostname = 'us-gs-0.hexarena.io'
      store.gsHost = hostname
      return hostname
    }
    case 'hexarena.io':
    case 'hex-gc-live.now.sh': {
      const { data: hostname } = await Api.ws.get('/config/gs-host')
      store.gsHost = hostname
      return hostname
    }
    default:
      const hostname = `${window.location.hostname}:8000`
      store.gsHost = hostname
      return hostname
  }
}

export default Api
