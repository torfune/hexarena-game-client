import getServerHost from './utils/getServerHost'
import Axios, { AxiosRequestConfig } from 'axios'

const PROTOCOL = window.location.protocol
const { GS_HOST, WS_HOST } = getServerHost()

const Api = {
  gs: {
    get: (path: string, config?: AxiosRequestConfig) => {
      return Axios.get(`${PROTOCOL}//${GS_HOST + path}`, config)
    },
  },
  ws: {
    get: (path: string, config?: AxiosRequestConfig) => {
      return Axios.get(`${PROTOCOL}//${WS_HOST + path}`, config)
    },
    patch: (path: string, data: any, config?: AxiosRequestConfig) => {
      return Axios.patch(`${PROTOCOL}//${WS_HOST + path}`, data, config)
    },
  },
}

export default Api
