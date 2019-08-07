import Axios, { AxiosRequestConfig } from 'axios'
import getGsHost from './utils/getGsHost'
import getWsHost from './utils/getWsHost'

const { protocol } = window.location

const Api = {
  gs: {
    get: async (path: string, config?: AxiosRequestConfig) => {
      const hostname = await getGsHost()
      return Axios.get(`${protocol}//${hostname + path}`, config)
    },
  },
  ws: {
    get: (path: string, config?: AxiosRequestConfig) => {
      const hostname = getWsHost()
      return Axios.get(`${protocol}//${hostname + path}`, config)
    },
    patch: (path: string, data: any, config?: AxiosRequestConfig) => {
      const hostname = getWsHost()
      return Axios.patch(`${protocol}//${hostname + path}`, data, config)
    },
  },
}

export default Api
