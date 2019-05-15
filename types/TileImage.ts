import Hearts from './Hearts'

interface TileImage {
  armyIcon: PIXI.Sprite | null
  arrow: PIXI.Sprite[]
  background: PIXI.Sprite | null
  base: PIXI.Sprite | null
  blackOverlay: PIXI.Sprite
  border: PIXI.Sprite[]
  camp: PIXI.Sprite | null
  castle: PIXI.Sprite | null
  contested: PIXI.Sprite
  fog: PIXI.Sprite[]
  forest: PIXI.Sprite | null
  hearts: Hearts | null
  hitpointsBg: PIXI.Sprite | null
  mountain: PIXI.Sprite | null
  pattern: PIXI.Sprite | null
  patternPreview: PIXI.Sprite | null
  village: PIXI.Sprite | null
}

export default TileImage
