import game from '../../..'
import Action from '../../Action'
import Parser from '../../Parser'
import getTileByXZ from '../../../functions/getTileByXZ'

const handleAction = gsData => {
  const [gsAction] = Parser.parseAction(gsData)
  const tile = getTileByXZ(gsAction.x, gsAction.z)

  if (!tile) return

  if (!tile.action) {
    new Action({ ...gsAction, tile, isActive: true })
  } else if (gsAction.status === 'done') {
    tile.action.destroy()
  } else if (!tile.action.isActive) {
    tile.action.activate(gsAction.finishedAt, gsAction.duration)
  }

  game.updatePatternPreviews()
  game.updateHoveredTileInfo()
}

export default handleAction
