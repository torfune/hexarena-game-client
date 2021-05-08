import getPixelPosition from '../functions/getPixelPosition'
import store from '../store'
import createImage from '../functions/createImage'
import hex from '../functions/hex'
import {
  BEDROCK_BORDER,
  BEDROCK_BACKGROUND,
  HOVER_HEXAGON_OPACITY,
  MOUNTAIN_BACKGROUND,
  ATTENTION_NOTIFICATION_RADIUS,
  ATTENTION_NOTIFICATION_ALPHA,
  TILE_RADIUS,
  MOUNTAIN_OFFSET_Y,
} from '../../constants/constants-game'
import getImageAnimation from '../functions/getImageAnimation'
import Player from './Player'
import Animation from './Animation'
import TileImage from '../../types/TileImage'
import { Axial } from '../../types/coordinates'
import Action, { ActionType } from './Action'
import TileImageArray from '../../types/TileImageArray'
import { Sprite } from 'pixi.js'
import getRotationBySide from '../functions/getRotationBySide'
import destroyImage from '../functions/destroyImage'
import axialInDirection from '../../utils/axialInDirection'
import getTileByAxial from '../functions/getTileByAxial'
import Forest from './Forest'
import Village from './Village'
import { easeInQuad, easeOutQuad } from '../functions/easing'
import Building from './Building'
import isSpectating from '../../utils/isSpectating'
import * as PIXI from 'pixi.js'
import { Graphics } from 'pixi.js'
import ArmySendManager from './ArmySendManager'
import colorFilter from '../../utils/colorFilter'
import { v4 as uuid } from 'uuid'

const PATTERN_ALPHA = 1
const PATTERN_PREVIEW_ALPHA = 0.2

class Tile {
  readonly id: string
  readonly axial: Axial
  readonly bedrock: boolean
  readonly mountain: boolean
  readonly createdAt: number
  forest: Forest | null = null
  village: Village | null = null
  action: Action | null = null
  building: Building | null = null
  owner: Player | null = null
  neighbors: Array<Tile | null> = []
  image: TileImage = {}
  imageSet: TileImageArray = {
    arrow: [],
    border: [],
    fog: [],
  }
  patternPreviewColor: string | null = null

  constructor(id: string, axial: Axial, mountain: boolean, bedrock: boolean) {
    this.id = id
    this.axial = axial
    this.bedrock = bedrock
    this.mountain = mountain
    this.createdAt = Date.now()

    if (mountain) {
      const mountainImage = this.addImage('mountain')
      mountainImage.y -= MOUNTAIN_OFFSET_Y
    }

    if (store.game) {
      store.game.tiles.set(id, this)
    }
  }

  startHover() {
    if (
      !store.game ||
      !store.game.player?.alive ||
      store.game.player.surrendered
    ) {
      return
    }

    // if (this.building && !this.building.army && !this.building.isCamp()) {
    //   this.building.showHitpoints()
    // }

    if (!this.isOwnedByThisPlayer()) return

    const { supplyLinesEditModeActive } = store.game

    // Supply Lines edit mode
    if (supplyLinesEditModeActive) {
      if (this.building) {
        this.addHoverHexagon()
      }
    } else {
      // Create Action
      this.showActionPreviewIfPossible()

      // Send Army
      if (this.building && this.building.army) {
        this.addHoverHexagon()
      }
    }
  }

  endHover() {
    const { gsConfig, game } = store
    if (!gsConfig || !game) return

    const { building } = this
    if (building && building.hasFullHp()) {
      building.hideHitpoints()
    }

    if (!ArmySendManager.active) {
      if (this.action && this.action.status === 'PREVIEW') {
        this.action.destroy()
      }
      this.removeHoverHexagon()
    }
  }

  addHoverHexagon() {
    if (this.bedrock || this.image['overlay']) return

    const pixel = getPixelPosition(this.axial)
    const image = createImage('overlay', { group: 'overlay' })

    image.x = pixel.x
    image.y = pixel.y
    image.scale.set(0)
    image.tint = hex('#000')
    this.image['overlay'] = image

    const animation = getImageAnimation(this.image['overlay'])
    let initialFraction: number | undefined = undefined
    if (animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    new Animation(
      this.image['overlay'],
      (image, fraction) => {
        image.alpha = fraction * HOVER_HEXAGON_OPACITY
        image.scale.set(fraction)
      },
      {
        initialFraction,
        speed: 0.25,
      }
    )
  }

  removeHoverHexagon() {
    const image = this.image['overlay']
    if (!image || !store.game) return

    delete this.image['overlay']

    const animation = getImageAnimation(image)
    let initialFraction
    if (animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    new Animation(
      image,
      (image, fraction) => {
        fraction = 1 - fraction
        image.alpha = fraction * HOVER_HEXAGON_OPACITY
        image.scale.set(fraction)
      },
      {
        initialFraction,
        speed: 0.1,
        onFinish: (image) => {
          if (store.game && store.game.pixi) {
            store.game.pixi.stage.removeChild(image)
          }
        },
      }
    )
  }

  addImage(imageName: keyof TileImage, animate = true) {
    if (Date.now() - this.createdAt < 500) {
      animate = false
    }

    let texture: string = imageName
    let zIndex: number | undefined = undefined
    let axialZ: number | undefined = undefined
    let alpha = 1
    let group: any = 'objects'

    if (imageName === 'background') {
      texture = this.bedrock ? 'overlay' : 'pattern'
    } else if (imageName === 'mountain') {
      texture = `mountain-${Math.floor(Math.random() * 5 + 1)}`
      // zIndex = IMAGE_Z_INDEX.indexOf('mountain')
    }

    if (
      imageName === 'castle' ||
      imageName === 'capital' ||
      imageName === 'tower' ||
      imageName === 'camp' ||
      imageName === 'mountain'
    ) {
      axialZ = this.axial.z
    }

    if (imageName === 'pattern') {
      alpha = PATTERN_ALPHA
      group = 'patterns'
    }

    const pixel = getPixelPosition(this.axial)
    const image = createImage(texture, { group })

    image.x = pixel.x
    image.y = pixel.y
    image.alpha = alpha
    this.image[imageName] = image

    if (animate) {
      image.alpha = 0
      image.scale.set(0)
      new Animation(
        image,
        (image, fraction) => {
          image.alpha = fraction
          if (imageName === 'pattern') {
            image.alpha = fraction * PATTERN_ALPHA
          }
          image.scale.set(fraction)
        },
        {
          speed: 0.05,
        }
      )
    }

    return image
  }

  removeImage(key: keyof TileImage, animate = true) {
    const image = this.image[key]

    if (!image || !store.game) return

    delete this.image[key]

    if (animate) {
      new Animation(
        image,
        (image, fraction) => {
          image.alpha = 1 - fraction
          image.scale.set(1 - fraction)
        },
        {
          onFinish: (image) => {
            if (store.game && store.game.pixi) {
              store.game.pixi.stage.removeChild(image)
            }
          },
          speed: 0.05,
        }
      )
    } else {
      if (store.game && store.game.pixi) {
        store.game.pixi.stage.removeChild(image)
      }
    }
  }

  setOwner(newOwner: Player | null) {
    if (!store.game) return

    // Tile turned owned
    if (newOwner) {
      if (this.image.pattern) {
        this.removeImage('pattern')
      }

      if (this.image.background) {
        this.removeImage('background')
      }

      const image = this.addImage('pattern', false)
      image.tint = hex(newOwner.getPattern())

      if (Date.now() - this.createdAt > 500) {
        image.alpha = 0
        image.scale.set(0)
        setTimeout(() => {
          new Animation(
            image,
            (image, fraction) => {
              image.alpha = fraction * PATTERN_ALPHA
              image.scale.set(fraction)
            },
            {
              initialFraction: 0.6,
              speed: 0.02,
            }
          )
        }, Math.round(Math.random() * 100))
      }
    }

    // Tile turned neutral
    else {
      if (this.image.pattern) {
        const patternImage = this.image.pattern
        setTimeout(() => {
          if (this.image.pattern === patternImage) {
            new Animation(
              this.image.pattern,
              (image, fraction) => {
                image.alpha = 1 - fraction
                image.scale.set(1 - fraction)
              },
              {
                speed: 0.04,
                onFinish: (image) => {
                  destroyImage(image as Sprite)
                },
              }
            )
          }
        }, Math.round(Math.random() * 100))
      }

      // Create Background
      if (!this.image.background) {
        const image = this.addImage('background')
        ;(image as any).parentGroup = store.game.backgroundGroup

        if (this.bedrock) {
          image.tint = hex(BEDROCK_BACKGROUND)
        } else if (this.mountain) {
          image.tint = hex(MOUNTAIN_BACKGROUND)
        }
      }
    }

    if (
      !store.game.spawnTile &&
      (newOwner?.id === store.game.playerId || isSpectating())
    ) {
      store.game.spawnTile = this
    }

    this.owner = newOwner

    if (this.isHovered() && this.isOwnedByThisPlayer()) {
      this.showActionPreviewIfPossible()
    }
  }

  updateNeighbors() {
    const neighbors = []
    for (let i = 0; i < 6; i++) {
      const axial = axialInDirection(this.axial, i)
      neighbors[i] = getTileByAxial(axial)
    }

    this.neighbors = neighbors
    this.updateFogs()
  }

  updateFogs() {
    if (!store.game) return

    for (let i = 0; i < 6; i++) {
      const image = this.imageSet.fog[i]

      if (!this.neighbors[i] && !image) {
        const pixel = getPixelPosition(this.axial)
        const newImage = createImage('fog', {
          group: 'fogs',
          // zIndex: FOG_Z_INDEX
        })
        ;(newImage as any).parentGroup = store.game.fogsGroup

        newImage.x = pixel.x
        newImage.y = pixel.y - TILE_RADIUS * 2
        newImage.anchor.set(0.5, 0.5)
        newImage.rotation = getRotationBySide(i)

        this.imageSet.fog[i] = newImage
      } else if (this.neighbors[i] && image) {
        destroyImage(image)
        this.imageSet.fog[i] = null
      }
    }
  }

  updateBorders() {
    if (!store.game) return

    const now = Date.now()

    for (let i = 0; i < 6; i++) {
      const n = this.neighbors[i]

      if (!n) continue

      let showBorder = false
      let patternPreview = false
      let borderTint: string | null = null

      // Bedrock -> !Bedrock
      // if (this.bedrock && !n.bedrock) {
      //   showBorder = true
      //   // borderTint = BEDROCK_BORDER
      // }

      // !Bedrock -> Bedrock
      // if (!this.bedrock && n.bedrock) {
      //   showBorder = true
      //   // borderTint = BEDROCK_BORDER
      // }

      // Owned -> Neutral
      if (this.owner && this.owner.alive && !n.owner) {
        showBorder = true
        borderTint = this.owner.pattern
      }

      // Neutral -> Owned
      if (!this.owner && n.owner && n.owner.alive) {
        showBorder = true
        borderTint = n.owner.pattern
      }

      // Owned -> Owned
      if (this.owner && n.owner && this.owner.id !== n.owner.id) {
        showBorder = true

        if (this.owner.tilesCount > n.owner.tilesCount && this.owner.alive) {
          borderTint = this.owner.pattern
        } else if (n.owner.alive) {
          borderTint = n.owner.pattern
        }
      }

      // Preview -> Neutral
      if (this.hasPatternPreview() && !n.owner && !n.hasPatternPreview()) {
        showBorder = true
        patternPreview = true

        if (this.patternPreviewColor) {
          borderTint = this.patternPreviewColor
        }
      }

      // Preview -> Owned
      if (this.hasPatternPreview() && n.owner && !n.hasPatternPreview()) {
        showBorder = true
        patternPreview = true

        if (this.patternPreviewColor) {
          borderTint = this.patternPreviewColor
        }
      }

      // Darken the border color
      if (borderTint) {
        borderTint = colorFilter(borderTint, -0.5)
      }

      const image = this.imageSet.border[i]
      if (showBorder && !image) {
        const pixel = getPixelPosition(this.axial)
        const newImage = createImage('border', { group: 'borders' })

        newImage.x = pixel.x
        newImage.y = pixel.y - TILE_RADIUS * 2
        newImage.anchor.set(0.5, 0.5)
        newImage.rotation = getRotationBySide(i)
        newImage.tint = hex(borderTint || BEDROCK_BORDER)

        if (!patternPreview && now - this.createdAt > 500) {
          newImage.alpha = 0
          new Animation(
            newImage,
            (image, fraction) => {
              image.alpha = fraction
            },
            {
              ease: easeInQuad,
              speed: 0.06,
            }
          )
        }

        this.imageSet.border[i] = newImage
      } else if (showBorder && image) {
        image.tint = hex(borderTint || BEDROCK_BORDER)
      } else if (!showBorder && image) {
        destroyImage(image)
        this.imageSet.border[i] = null
      }
    }
  }

  isHovered() {
    if (!store.game) return false
    return !!store.game.hoveredTile && store.game.hoveredTile.id === this.id
  }

  isEmpty() {
    return !this.building && !this.forest && !this.village && !this.mountain
  }

  addPatternPreview(pattern: string) {
    if (this.hasPatternPreview()) {
      console.warn('WARN: Cannot add pattern preview.')
      return
    }

    if (this.image.pattern) {
      this.image.pattern.visible = false
    }

    const pixel = getPixelPosition(this.axial)
    this.image['pattern-preview'] = createImage('pattern', {
      group: 'patterns',
    })
    this.image['pattern-preview'].x = pixel.x
    this.image['pattern-preview'].y = pixel.y
    this.image['pattern-preview'].tint = hex(pattern)
    this.image['pattern-preview'].alpha = PATTERN_PREVIEW_ALPHA

    this.patternPreviewColor = pattern
    this.updateNeighborsBorders()
    this.updateBorders()
  }

  removePatternPreview() {
    if (!this.hasPatternPreview() || !store.game || !store.game.pixi) {
      console.warn('WARN: Cannot remove pattern preview.')
      return
    }

    if (this.image.pattern) {
      this.image.pattern.visible = true
    }

    store.game.pixi.stage.removeChild(this.image['pattern-preview']!)
    this.image['pattern-preview'] = undefined

    this.patternPreviewColor = null
    this.updateNeighborsBorders()
    this.updateBorders()
  }

  getStructureName() {
    if (this.bedrock) {
      return 'Edge of the World'
    } else if (this.mountain) {
      return 'Mountains'
    } else if (this.forest) {
      return 'Forest'
    } else if (this.building) {
      switch (this.building.type) {
        case 'CAPITAL':
          return 'Capital'
        case 'CAMP':
          return 'Camp'
        case 'TOWER':
          return 'Tower'
        case 'CASTLE':
          return 'Castle'
      }
    } else if (this.village) {
      return `Village`
    }

    return 'Plains'
  }

  getActionType(options?: { ignoreGold: boolean }): ActionType | null {
    const ignoreGold = options ? options.ignoreGold : false

    if (!store.game || !store.gsConfig || !store.game.player) {
      return null
    }

    const {
      RECRUIT_ARMY_COST,
      BUILD_CAMP_COST,
      BUILD_TOWER_COST,
      BUILD_CASTLE_COST,
      REBUILD_VILLAGE_COST,
    } = store.gsConfig

    // Neighbor check
    let isNeighbor = false
    for (let i = 0; i < 6; i++) {
      const n = this.neighbors[i]
      if (n && n.owner && n.owner.id === store.game.playerId) {
        isNeighbor = true
        break
      }
    }

    if (this.owner?.id !== store.game.playerId) return null

    // CAMP
    const forestGold = this.forest ? this.forest.treeCount : 0
    if (
      (this.isEmpty() || this.forest) &&
      (store.game.player.gold >= BUILD_CAMP_COST - forestGold || ignoreGold)
    ) {
      return 'BUILD_CAMP'
    }

    // TOWER
    if (
      this.building &&
      this.building.type === 'CAMP' &&
      (store.game.player.gold >= BUILD_TOWER_COST || ignoreGold)
    ) {
      return 'BUILD_TOWER'
    }

    // RECRUIT
    if (
      this.building &&
      (store.game.player.gold >= RECRUIT_ARMY_COST || ignoreGold) &&
      (this.building.type === 'CAPITAL' || this.building.type === 'CASTLE') &&
      !this.building.army
    ) {
      return 'RECRUIT_ARMY'
    }

    // CASTLE
    if (
      this.building &&
      this.building.type === 'TOWER' &&
      (store.game.player.gold >= BUILD_CASTLE_COST || ignoreGold)
    ) {
      return 'BUILD_CASTLE'
    }

    // REBUILD_VILLAGE
    if (
      this.village &&
      this.village.raided &&
      (store.game.player.gold >= REBUILD_VILLAGE_COST || ignoreGold)
    ) {
      return 'REBUILD_VILLAGE'
    }

    return null
  }

  setBuilding(newBuilding: Building) {
    this.building = newBuilding
  }

  createAttentionNotification() {
    if (!store.game || !store.game.pixi) return

    const pixel = getPixelPosition(this.axial)
    const circle = new PIXI.Graphics()
    // circle.zIndex = ATTENTION_NOTIFICATION_Z_INDEX

    new Animation(
      circle,
      (image, fraction) => {
        image = image as Graphics

        image.clear()
        image.beginFill(hex('#fff'))
        image.lineStyle(0)
        image.drawCircle(
          pixel.x,
          pixel.y,
          ATTENTION_NOTIFICATION_RADIUS * fraction
        )
        image.endFill()
        image.alpha = (1 - fraction) * ATTENTION_NOTIFICATION_ALPHA
      },
      {
        speed: 0.02,
        ease: easeOutQuad,
        onFinish: (image) => {
          if (store.game && store.game.pixi) {
            store.game.pixi.stage.removeChild(image)
          }
        },
      }
    )

    store.game.pixi.stage.addChild(circle)

    // const texture = app.renderer.generateTexture(graphics)
    // const circle = new PIXI.Sprite(texture)

    // app.stage.addChild(circle)
  }

  hasPatternPreview() {
    return !!this.image['pattern-preview']
  }

  getNeighbor(direction: number): Tile | null {
    return this.neighbors[direction] || null
  }

  isOwnedByThisPlayer(): boolean {
    if (!store.game || !store.game.player || !this.owner) return false

    return this.owner.id === store.game.player.id
  }

  updateNeighborsBorders() {
    for (let i = 0; i < 6; i++) {
      const n = this.getNeighbor(i)
      if (n) {
        n.updateBorders()
      }
    }
  }

  showActionPreviewIfPossible() {
    if (!store.game || !store.game.player) return

    if (this.action || (this.building && this.building.army)) return

    const actionType = this.getActionType()
    if (
      actionType &&
      !ArmySendManager.active &&
      !store.game.supplyLinesEditModeActive
    ) {
      new Action(uuid(), actionType, 'PREVIEW', this, store.game.player)
    }
  }
}

export default Tile
