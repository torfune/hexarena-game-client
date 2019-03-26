import game from '../../..'

const handleServerTime = serverTime => {
  const browserTime = Date.now()
  game.timeDiff = serverTime - browserTime

  if (game.timeDiff < 0) {
    game.timeDiff = 0
  }

  console.log(`Browser time difference: ${game.timeDiff}`)
}

export default handleServerTime
