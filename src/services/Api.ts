import Axios, { AxiosRequestConfig } from 'axios'
import store from '../core/store'

const Api = {
  gs: {
    get: async (path: string, config?: AxiosRequestConfig) => {
      const { protocol } = window.location
      const host = await getGameServerHost()
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

export const getGameServerHost = async () => {
  if (store.gameServerHost) return store.gameServerHost

  const { data } = await Api.ws.get('/config/game-server-host')
  store.gameServerHost = data.gameServerHost

  return store.gameServerHost!
}

export default Api
