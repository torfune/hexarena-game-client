import Axios from 'axios'
import getGameServerUrl from '../utils/getGameServerHost'

class GameServerApi {
  static getConfig() {
    return Axios.get(`${getGameServerUrl()}/config`)
  }

  static getStatus() {
    return Axios.get(`${getGameServerUrl()}/status`)
  }
}

export default GameServerApi
