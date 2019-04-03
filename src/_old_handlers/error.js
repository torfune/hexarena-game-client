import game from '../../..'

const handleError = () => {
  game.react.showConnectionError()
  game.stop()
}

export default handleError
