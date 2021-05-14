import qs from 'query-string'
import store from '../core/store'

function getGameServerUrl() {
  const { protocol, search: query } = window.location
  const { gameServerHost } = qs.parse(query)
  if (!gameServerHost) {
    console.error('ERROR: Missing game server host in query-string.')
    store.error = 'Connection failed.'
    return
  }

  return `${protocol}//${gameServerHost}`
}

export default getGameServerUrl
