import game from '../../..'
import Action from '../../Action'
import Parser from '../../Parser'
import getTileByXZ from '../../../functions/getTileByXZ'
import getItemById from '../../../functions/getItemById'

const handleActionQueue = gsData => {
  const newActionQueue = Parser.parseAction(gsData)

  game.react.setActionQueue(newActionQueue)

  for (let i = 0; i < game.actionQueue.length; i++) {
    const gsAction = game.actionQueue[i]
    const tile = getTileByXZ(gsAction.x, gsAction.z)

    if (
      !getItemById(newActionQueue, gsAction.id) &&
      tile.action &&
      !tile.action.isActive
    ) {
      tile.action.destroy()
    }
  }

  game.actionQueue = newActionQueue

  for (let i = 0; i < game.actionQueue.length; i++) {
    const gsAction = game.actionQueue[i]
    const tile = getTileByXZ(gsAction.x, gsAction.z)

    if (!tile.action) {
      new Action({ ...gsAction, tile, isActive: false, number: i })
    } else {
      tile.action.setNumber(i)
    }
  }
}

export default handleActionQueue
