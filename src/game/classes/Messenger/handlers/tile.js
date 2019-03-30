import game from '../../..'
import Tile from '../../Tile'
import Parser from '../../Parser'
import getTileByXZ from '../../../functions/getTileByXZ'
import getItemById from '../../../functions/getItemById'

const handleTile = gsData => {
  const gsTiles = Parser.parseTile(gsData)

  for (let i = 0; i < gsTiles.length; i++) {
    const gsTile = gsTiles[i]
    const tile = getTileByXZ(gsTile.x, gsTile.z)
    const gsOwner = gsTile.ownerId
      ? getItemById(game.players, gsTile.ownerId)
      : null

    if (tile) {
      if (gsOwner !== tile.owner) {
        tile.setOwner(gsOwner)
      }

      const structures = [
        ['capital', 'addCapital', 'removeCapital'],
        ['castle', 'addCastle', 'removeCastle'],
        ['forest', 'addForest', 'removeForest'],
        ['village', 'addVillage', 'removeVillage'],
        ['camp', 'addCamp', 'removeCamp'],
      ]

      // Hitpoints
      if (gsTile.hitpoints && !tile.hitpoints) {
        tile.addHitpoints(gsTile.hitpoints)
      } else if (gsTile.hitpoints === null && tile.hitpoints) {
        tile.removeHitpoints()
      } else if (gsTile.hitpoints !== tile.hitpoints) {
        tile.updateHitpoints(gsTile.hitpoints)
      }

      for (let j = 0; j < structures.length; j++) {
        const [structure, addMethod, removeMethod] = structures[j]

        if (gsTile[structure] && !tile[structure]) {
          tile[addMethod]()
        } else if (!gsTile[structure] && tile[structure]) {
          tile[removeMethod]()
        }
      }
    } else {
      game.tiles.push(new Tile({ ...gsTile, owner: gsOwner }))

      if (game.tiles.length === 1) {
        game.handleFirstTileArrival()
      }
    }
  }

  for (let i = 0; i < game.tiles.length; i++) {
    game.tiles[i].updateBlackOverlay()
  }

  game.updatePlayerTilesCount()
  game.updateNeighbors()
  game.updateBorders()
  game.updateHoveredTileInfo()
}

export default handleTile
