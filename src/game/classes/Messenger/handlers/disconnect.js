import game from '../../..'

const handleDisconnect = () => {
  if (!game.defeated) {
    game.react.showConnectionError()
  }

  game.stop()
  console.log('Disconnected.')
}

export default handleDisconnect
