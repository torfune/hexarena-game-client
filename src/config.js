// Always commit with value .... true
export const REMOTE_GAMESERVER = true

let GAMESERVER_URL = 'http://localhost:8000'

if (REMOTE_GAMESERVER) {
  GAMESERVER_URL = 'http://dev.hexagor.io:8000'
}

if (process.env.REACT_APP_GSURL) {
  GAMESERVER_URL = process.env.REACT_APP_GSURL
}

export { GAMESERVER_URL }
