// Always commit with value .... true
export const REMOTE_GAMESERVER = true

export const GAMESERVER_URL = REMOTE_GAMESERVER
  ? 'http://dev.hexagor.io:8000'
  : 'http://localhost:8000'
