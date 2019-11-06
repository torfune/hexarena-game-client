import Tile from './Tile'
import { Sprite, Loader } from 'pixi.js'
import Army from './Army'
import pixelFromAxial from '../functions/pixelFromAxial'
import store from '../../store'
import animate from '../functions/animate'

const { resources } = Loader.shared
const dummySprite = new Sprite()

class UnitPreviewManager {
  static army: Army | null = null
  static direction: number | null = null
  static previewTiles: PreviewTile[] = []

  static setArmy(army: Army | null) {
    this.army = army
  }

  static setDirection(direction: number | null) {
    if (this.direction === direction) return

    this.clear()
    this.direction = direction

    if (!this.army || direction === null) return

    const previewTiles = getPreviewTiles(this.army, direction)
    for (let i = 0; i < previewTiles.length; i++) {
      const previewTile = previewTiles[i]
      previewTile.image = createImage(previewTile, i * 60)
    }

    this.previewTiles = previewTiles
  }

  static clear() {
    for (let i = 0; i < this.previewTiles.length; i++) {
      const { image } = this.previewTiles[i]
      if (image.alpha === 1) {
        animate({
          image,
          duration: 150,
          ease: 'IN',
          onUpdate: (image, fraction) => {
            image.alpha = 1 - fraction
            image.scale.set(1 - fraction)
          },
          onFinish: image => {
            if (!store.game) return
            const stage = store.game.stage.get('unitPreview')
            if (stage) {
              stage.removeChild(image)
            }
          },
        })
      } else {
        if (!store.game) return
        const stage = store.game.stage.get('unitPreview')
        if (stage) {
          stage.removeChild(image)
        }
      }
    }

    this.direction = null
    this.previewTiles = []
  }

  static updatePreviewTiles() {
    if (!this.army || this.direction === null) return

    const newPreviewTiles = getPreviewTiles(this.army, this.direction)
    for (let i = 0; i < newPreviewTiles.length; i++) {
      const newPreviewTile = newPreviewTiles[i]
      const oldPreviewTile = this.previewTiles[i]

      if (oldPreviewTile) {
        const { unitCost, unitCount, cantCapture } = newPreviewTile
        const texture = getTexture(unitCost, unitCount, cantCapture)
        oldPreviewTile.image.texture = texture
      } else {
        newPreviewTile.image = createImage(newPreviewTile, 0)
        this.previewTiles[i] = newPreviewTile
      }
    }
  }
}

interface PreviewTile {
  tile: Tile
  image: Sprite
  unitCost: number
  unitCount: number
  cantCapture: boolean
}

const getPreviewTiles = (army: Army, direction: number) => {
  let previewTiles: PreviewTile[] = []
  let steps = army.unitCount

  const addPreviewTile = (tile: Tile, unitCost: number) => {
    if (!store.game) return

    const { mountain, forest, bedrock, ownerId } = tile
    const unitCount = steps
    const enemyMountain = mountain && ownerId && ownerId !== army.ownerId
    const enemyForest = forest && ownerId && ownerId !== army.ownerId
    const cantCapture = enemyMountain || enemyForest || bedrock

    previewTiles.push({
      tile,
      image: dummySprite,
      unitCost,
      unitCount,
      cantCapture,
    })

    if (cantCapture) {
      steps = 0
    } else {
      steps -= unitCost
    }
  }

  const firstTile = army.tile.neighbors[direction]
  if (firstTile && !firstTile.building) {
    addPreviewTile(firstTile, firstTile.unitCost(army.ownerId))
  } else {
    return previewTiles
  }

  while (steps > 0) {
    const lastPreviewTile = previewTiles[previewTiles.length - 1]
    const tile = lastPreviewTile.tile.neighbors[direction]
    if (!tile || tile.building) break

    let unitCost = tile.unitCost(army.ownerId)
    if (lastPreviewTile.tile.village) {
      unitCost = 0
    }
    addPreviewTile(tile, unitCost)
  }

  return previewTiles
}

const createImage = (previewTile: PreviewTile, delay: number) => {
  if (!store.game) return new Sprite()

  const { unitCost, unitCount, cantCapture, tile } = previewTile
  const texture = getTexture(unitCost, unitCount, cantCapture)
  const image = new Sprite(texture)
  const pixel = pixelFromAxial(tile.axial)
  image.x = pixel.x
  image.y = pixel.y
  image.anchor.set(0.5)
  image.scale.set(0)
  image.alpha = 0
  animate({
    image,
    duration: 200,
    delay,
    ease: 'OUT',
    onUpdate: (image, fraction) => {
      image.scale.set(fraction)
      image.alpha = fraction
    },
  })
  const stage = store.game.stage.get('unitPreview')
  if (stage) {
    stage.addChild(image)
  }

  return image
}

const getTexture = (
  unitCost: number,
  unitCount: number,
  cantCapture: boolean
) => {
  if (unitCount < unitCost || cantCapture) {
    return resources['unit-preview-cant-capture'].texture
  }

  switch (unitCost) {
    case 1:
      return resources['unit-preview-1'].texture
    case 3:
      return resources['unit-preview-3'].texture
    case 4:
      return resources['unit-preview-4'].texture
    default:
      return resources['unit-preview-0'].texture
  }
}

export default UnitPreviewManager
