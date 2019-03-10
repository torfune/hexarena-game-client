import game from '../../..'

const handleDefeat = killerName => {
  const msSurvived = Date.now() - game.startedAt
  const secondsSurvived = Math.floor(msSurvived / 1000)

  game.react.showDefeatScreen({ killerName, secondsSurvived })

  game.defeated = true
}

export default handleDefeat
