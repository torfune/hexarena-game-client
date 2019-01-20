const getTileByXZ = (tiles, x, z) => {
  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].x === x && tiles[i].z === z) {
      return tiles[i]
    }
  }

  return null
}

export default getTileByXZ
