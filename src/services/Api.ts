import Axios, { AxiosRequestConfig } from 'axios'
import store from '../core/store'

const Api = {
  gs: {
    get: async (path: string, config?: AxiosRequestConfig) => {
      const { protocol } = window.location
      const host = await getGameServerHostname()
      return Axios.get(`${protocol}//${host + path}`, config)
    },
  },
  ws: {
    get: (path: string, config?: AxiosRequestConfig) => {
      const { protocol } = window.location
      return Axios.get(`${protocol}//${getWebServerHostname() + path}`, config)
    },
    post: (path: string, data: any, config?: AxiosRequestConfig) => {
      const { protocol } = window.location
      return Axios.post(
        `${protocol}//${getWebServerHostname() + path}`,
        data,
        config
      )
    },
    patch: (path: string, data: any, config?: AxiosRequestConfig) => {
      const { protocol } = window.location
      return Axios.patch(
        `${protocol}//${getWebServerHostname() + path}`,
        data,
        config
      )
    },
  },
}

const getWebServerHostname = () => {
  switch (window.location.origin) {
    case 'http://localhost:4000':
      return 'localhost:7000'

    case 'https://test.hexarena.io':
      return 'us-ws-0.hexarena.io'

    case 'https://hexarena.io':
      return 'us-ws-1.hexarena.io'

    default:
      return 'us-ws-0.hexarena.io'
  }
}

export const getGameServerHostname = async () => {
  if (store.gameServerHostname) return store.gameServerHostname

  switch (window.location.origin) {
    case 'http://localhost:4000': {
      store.gameServerHostname = 'localhost:8000'
      break
    }

    case 'https://test.hexarena.io': {
      store.gameServerHostname = 'us-gs-0.hexarena.io'
      break
    }

    case 'https://hexarena.io': {
      const { data: hostname } = await Api.ws.get('/config/gs-host')
      store.gameServerHostname = hostname
      break
    }

    default:
      store.gameServerHostname = 'us-gs-0.hexarena.io'
      break
  }

  return store.gameServerHostname!
}

export default Api
