import game from '../../..'
import Army from '../../Army'
import Parser from '../../Parser'
import getTileByXZ from '../../../functions/getTileByXZ'
import getItemById from '../../../functions/getItemById'

const handleArmy = gsData => {
  const [gsArmy] = Parser.parseArmy(gsData)
  const tile = getTileByXZ(gsArmy.x, gsArmy.z)
  const army = getItemById(game.armies, gsArmy.id)

  if (!tile) {
    if (army) {
      army.destroy()
    }

    return
  }

  if (!army && !gsArmy.isDestroyed) {
    const army = new Army({ ...gsArmy, tile })
    game.armies.push(army)
  } else if (army) {
    if (gsArmy.isDestroyed) {
      army.destroy()
    }

    army.moveOn(tile)
  }
}

export default handleArmy
