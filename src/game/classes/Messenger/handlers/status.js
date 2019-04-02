import game from '../../..'

const handleStatus = status => {
  game.react.setStatus(status)
  game.status = status
}

export default handleStatus
