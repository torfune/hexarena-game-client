import Axios from 'axios'
import store from './store'

class Api {
  static async getConfig() {
    const { protocol } = window.location
    const host = await gsHost()
    const response = await Axios.get(`${protocol}//${host}/config`)
    return response.data
  }
  static async getGsHost() {
    const { protocol } = window.location
    const host = wsHost()
    const response = await Axios.get(`${protocol}//${host}/config/gs-host`)
    return response.data.hostname
  }

  // gs: {
  //   get: async (path: string, config?: AxiosRequestConfig) => {
  //     const host = await gsHost()
  //     return Axios.get(`${protocol}//${host + path}`, config)
  //   },
  // },
  // ws: {
  //   get: (path: string, config?: AxiosRequestConfig) => {
  //     return Axios.get(`${protocol}//${wsHost() + path}`, config)
  //   },
  //   post: (path: string, data: any, config?: AxiosRequestConfig) => {
  //     return Axios.post(`${protocol}//${wsHost() + path}`, data, config)
  //   },
  //   patch: (path: string, data: any, config?: AxiosRequestConfig) => {
  //     return Axios.patch(`${protocol}//${wsHost() + path}`, data, config)
  //   },
  // },
}

const wsHost = () => {
  switch (window.location.hostname) {
    case 'localhost':
      return 'localhost:5000'
    case 'dev.hexarena.io':
      return 'us-ws-0.hexarena.io'
    case 'hexarena.io':
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
    case 'hexarena.io': {
      store.gsHost = await Api.getGsHost()
      return store.gsHost
    }
    default:
      const hostname = `${window.location.hostname}:8000`
      store.gsHost = hostname
      return hostname
  }
}

export default Api
