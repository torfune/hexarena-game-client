class Player {
  constructor({ id, name, pattern, tilesCount, allyId, allyDied, alive }) {
    this.id = id
    this.name = name
    this.pattern = pattern
    this.tilesCount = tilesCount
    this.allyId = allyId
    this.allyDied = allyDied
    this.alive = alive
  }
}

export default Player
