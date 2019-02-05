import game from '../../game'

const getTileByXZ = (x, z) => {
  for (let i = 0; i < game.tiles.length; i++) {
    if (game.tiles[i].x === x && game.tiles[i].z === z) {
      return game.tiles[i]
    }
  }

  return null
}

export default getTileByXZ
