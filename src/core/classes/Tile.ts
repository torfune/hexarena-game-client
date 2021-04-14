import getPixelPosition from '../functions/getPixelPosition'
import store from '../store'
import createImage from '../functions/createImage'
import hex from '../functions/hex'
import {
  BEDROCK_BORDER,
  BEDROCK_BACKGROUND,
  HOVER_HEXAGON_OPACITY,
  IMAGE_Z_INDEX,
  FOG_Z_INDEX,
  MOUNTAIN_BACKGROUND,
  BORDER_COLOR,
  ATTENTION_NOTIFICATION_Z_INDEX,
  ATTENTION_NOTIFICATION_RADIUS,
  ATTENTION_NOTIFICATION_ALPHA,
} from '../../constants/constants-game'
import getImageAnimation from '../functions/getImageAnimation'
import Player from './Player'
import Animation from './Animation'
import TileImage from '../../types/TileImage'
import { Axial } from '../../types/coordinates'
import Action from './Action'
import TileImageArray from '../../types/TileImageArray'
import { Sprite } from 'pixi.js-legacy'
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

  constructor(id: string, axial: Axial, mountain: boolean, bedrock: boolean) {
    this.id = id
    this.axial = axial
    this.bedrock = bedrock
    this.mountain = mountain
    this.createdAt = Date.now()

    if (mountain) {
      const image = this.addImage('mountain')
      image.y -= 16
    }

    if (store.game) {
      store.game.tiles.set(id, this)
    }
  }

  // setProp(key: keyof Props, value: Primitive) {
  //   if (this.props[key].current === value || !store.game) return
  //
  //   this.props[key].previous = this.props[key].current
  //   this.props[key].current = value
  //
  //   switch (key) {
  //     case 'ownerId': {
  //       this.updateOwner()
  //
  //       const { playerId } = store.game
  //       const { current, previous } = this.props.ownerId
  //       if (previous === playerId && current !== playerId) {
  //         SoundManager.play('TILE_LOSE')
  //       }
  //       break
  //     }
  //
  //     case 'camp': {
  //       if (this.camp && !this.image.camp) {
  //         const camp = this.addImage('camp')
  //         camp.anchor.set(0.5, 1)
  //         camp.y += IMAGE_OFFSET_Y.CAMP
  //       } else if (!this.camp && this.image.camp) {
  //         this.removeImage('camp')
  //       }
  //       break
  //     }
  //
  //     case 'buildingType': {
  //       if (value === 'CAPITAL') {
  //         if (!this.image.capital) {
  //           const capital = this.addImage('capital')
  //           capital.y += IMAGE_OFFSET_Y.CAPITAL
  //         }
  //       } else if (value === 'CASTLE') {
  //         if (!this.image.castle) {
  //           this.removeImage('tower')
  //           const castle = this.addImage('castle')
  //           castle.anchor.set(0.5, 1)
  //           castle.y += IMAGE_OFFSET_Y.CASTLE
  //         }
  //       } else if (value === 'TOWER') {
  //         if (!this.image.tower) {
  //           const tower = this.addImage('tower')
  //           tower.anchor.set(0.5, 1)
  //           tower.y += IMAGE_OFFSET_Y.TOWER
  //         }
  //       } else if (value === null) {
  //         this.removeImage('capital')
  //         this.removeImage('tower')
  //         this.removeImage('castle')
  //       }
  //       this.updateHitpoints()
  //       break
  //     }
  //
  //     case 'buildingHp': {
  //       this.updateHitpoints()
  //       if (
  //         this.action &&
  //         this.action.type === 'RECRUIT' &&
  //         this.action.status !== 'FINISHED' &&
  //         this.building &&
  //         this.building.type !== 'TOWER'
  //       ) {
  //         this.action.icon.texture = this.action.getIconTexture()
  //       }
  //       break
  //     }
  //   }
  //
  //   // Sounds
  //   if (
  //     this.ownerId === store.game.playerId ||
  //     (isSpectating() && Date.now() - this.createdAt >= 500)
  //   ) {
  //     if (key === 'camp' && this.camp) {
  //       SoundManager.play('CAMP_CREATE')
  //     } else if (key === 'buildingType') {
  //       if (value === 'TOWER') {
  //         SoundManager.play('TOWER_CREATE')
  //       } else if (value === 'CASTLE') {
  //         SoundManager.play('CASTLE_CREATE')
  //       }
  //     }
  //   }
  // }

  // updateImage(key: keyof TileImage) {
  //   if (this.props[key].current && !this.image[key]) {
  //     this.addImage(key)
  //   } else {
  //     this.removeImage(key)
  //   }
  // }

  updateBlackOverlay() {
    // if (this.mountain && this.owner) {
    //   this.image.blackOverlay.visible = true
    // } else {
    //   this.image.blackOverlay.visible = false
    // }
  }

  startHover() {
    if (
      !store.game ||
      !store.game.player?.alive ||
      store.game.player.surrendered
    ) {
      return
    }

    // if (this.building && !this.army) {
    //   this.showHitpoints()
    // }

    if (
      (this.getActionType() && !store.game.selectedArmy) ||
      (this.building && this.building.army)
    ) {
      this.addHoverHexagon()
    }
  }

  endHover() {
    const { gsConfig, game } = store
    if (!gsConfig || !game) return

    // const { building } = this
    // if (building && building.hp === gsConfig.HP[building.type]) {
    //   this.hideHitpoints()
    // }

    if (game.selectedArmy?.tile !== this) {
      this.removeHoverHexagon()
    }
  }

  addHoverHexagon() {
    if (this.bedrock || this.image['overlay']) return

    // console.log('addHoverHexagon')

    // if (
    //   !this.owner ||
    //   !store.game ||
    //   store.game.player?.alive ||
    //   store.game.player?.surrendered ||
    //   !this.image.pattern
    // ) {
    //   return
    // }

    const pixel = getPixelPosition(this.axial)
    const image = createImage('overlay')

    image.x = pixel.x
    image.y = pixel.y
    image.scale.set(0)
    image.tint = hex('#000')
    this.image['overlay'] = image

    const animation = getImageAnimation(this.image['overlay'])
    let initialFraction: number | undefined = undefined
    if (animation && animation instanceof Animation) {
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
        speed: 0.1,
      }
    )
  }

  addContested() {
    // this.image.contested.visible = true
  }

  removeHoverHexagon() {
    const image = this.image['overlay']
    if (!image || !store.game) return

    delete this.image['overlay']

    const animation = getImageAnimation(image)
    let initialFraction
    if (animation && animation instanceof Animation) {
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
    // return new PIXI.Sprite()

    if (Date.now() - this.createdAt < 500) {
      animate = false
    }

    let texture: string = imageName
    let zIndex: number | undefined = undefined
    let axialZ: number | undefined = undefined

    if (imageName === 'background') {
      texture = this.bedrock ? 'overlay' : 'pattern'
    } else if (imageName === 'mountain') {
      texture = `mountain-${Math.floor(Math.random() * 5 + 1)}`
      zIndex = IMAGE_Z_INDEX.indexOf('mountain')
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

    const pixel = getPixelPosition(this.axial)
    const image = createImage(texture, {
      zIndex,
      axialZ,
    })

    image.x = pixel.x
    image.y = pixel.y
    this.image[imageName] = image

    if (animate) {
      image.alpha = 0
      image.scale.set(0)
      new Animation(
        image,
        (image, fraction) => {
          image.alpha = fraction
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

  // removeArmy() {
  //   if (!this.army || !store.game) return
  //
  //   this.army = null
  //   // this.hideArmyIcon()
  //
  //   if (store.game.selectedArmyTile === this) {
  //     this.unselectArmy()
  //   }
  // }

  setOwner(newOwner: Player | null) {
    if (!store.game) return

    // const newOwner = this.ownerId
    //   ? store.game.players.get(this.ownerId) || null
    //   : null

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
              image.alpha = fraction
              image.scale.set(fraction)
            },
            {
              initialFraction: 0.6,
              speed: 0.02,
            }
          )
        }, Math.round(Math.random() * 100))
      }
    } else {
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

        if (this.bedrock) {
          image.tint = hex(BEDROCK_BACKGROUND)
        } else if (this.mountain) {
          image.tint = hex(MOUNTAIN_BACKGROUND)
        }
      }
    }

    // if (store.game.selectedArmyTile === this) {
    //   this.unselectArmy()
    // }

    if (
      !store.game.spawnTile &&
      (newOwner?.id === store.game.playerId || isSpectating())
    ) {
      store.game.spawnTile = this
    }

    this.owner = newOwner
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
    for (let i = 0; i < 6; i++) {
      const image = this.imageSet.fog[i]

      if (!this.neighbors[i] && !image) {
        const pixel = getPixelPosition(this.axial)
        const newImage = createImage('fog', { zIndex: FOG_Z_INDEX })

        newImage.x = pixel.x
        newImage.y = pixel.y
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
      let borderTint = BORDER_COLOR

      // Bedrock -> !Bedrock
      if (this.bedrock && !n.bedrock) {
        showBorder = true
        borderTint = BEDROCK_BORDER
      }

      // !Bedrock -> Bedrock
      if (!this.bedrock && n.bedrock) {
        showBorder = true
        borderTint = BEDROCK_BORDER
      }

      // // Mountain -> !Mountain
      // if (this.mountain && !n.mountain) {
      //   showBorder = true
      //   borderTint = BEDROCK_BORDER
      // }
      //
      // // !Mountain -> Mountain
      // if (!this.mountain && n.mountain) {
      //   showBorder = true
      //   borderTint = BEDROCK_BORDER
      // }

      // Owned -> Neutral
      if (this.owner && !n.owner) {
        showBorder = true
      }

      // Neutral -> Owned
      if (!this.owner && n.owner) {
        showBorder = true
      }

      // Owned -> Owned
      if (
        this.owner &&
        n.owner &&
        this.owner.id !== n.owner.id &&
        this.owner.allyId !== n.owner.id
      ) {
        showBorder = true
      }

      // Preview -> Neutral
      if (
        store.game.tilesWithPatternPreview.includes(this) &&
        !n.owner &&
        !store.game.tilesWithPatternPreview.includes(n)
      ) {
        showBorder = true
        patternPreview = true
      }

      // Preview -> Owned
      if (
        store.game.tilesWithPatternPreview.includes(this) &&
        n.owner &&
        !store.game.tilesWithPatternPreview.includes(n)
      ) {
        showBorder = true
        patternPreview = true
      }

      const image = this.imageSet.border[i]
      if (showBorder && !image) {
        const pixel = getPixelPosition(this.axial)
        const newImage = createImage('border')

        newImage.x = pixel.x
        newImage.y = pixel.y
        newImage.rotation = getRotationBySide(i)
        newImage.tint = hex(borderTint)

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
      } else if (!showBorder && image) {
        destroyImage(image)
        this.imageSet.border[i] = null
      }
    }
  }

  isHovered() {
    if (!store.game) return false
    return store.game.hoveredTile && store.game.hoveredTile.id === this.id
  }

  isEmpty() {
    return !this.building && !this.forest && !this.village && !this.mountain
  }

  addPatternPreview(pattern: string) {
    if (this.image.pattern) {
      this.image.pattern.visible = false
    }

    const pixel = getPixelPosition(this.axial)

    this.image['pattern-preview'] = createImage('pattern')
    this.image['pattern-preview'].x = pixel.x
    this.image['pattern-preview'].y = pixel.y
    this.image['pattern-preview'].tint = hex(pattern)
    this.image['pattern-preview'].alpha = 0.3
  }

  removePatternPreview() {
    if (!this.image['pattern-preview'] || !store.game || !store.game.pixi) {
      return
    }

    if (this.image.pattern) {
      this.image.pattern.visible = true
    }

    store.game.pixi.stage.removeChild(this.image['pattern-preview'])
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

  getActionType(options?: { ignoreGold: boolean }) {
    const ignoreGold = options ? options.ignoreGold : false

    if (!store.game || !store.gsConfig || this.action || !store.game.player) {
      return null
    }

    const {
      RECRUIT_COST,
      CAMP_COST,
      TOWER_COST,
      CASTLE_COST,
      HP,
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

    // CAPTURE
    // if (
    //   isNeighbor &&
    //   !this.owner &&
    //   (store.game.player.gold >= this.captureCost() || ignoreGold)
    // ) {
    //   return 'CAPTURE'
    // }

    if (this.owner?.id !== store.game.playerId) return null

    // CAMP
    const forestGold = this.forest ? this.forest.treeCount : 0
    if (
      (this.isEmpty() || this.forest) &&
      (store.game.player.gold >= CAMP_COST - forestGold || ignoreGold)
    ) {
      return 'CAMP'
    }

    // TOWER
    if (
      this.building &&
      this.building.type === 'CAMP' &&
      (store.game.player.gold >= TOWER_COST || ignoreGold)
    ) {
      return 'TOWER'
    }

    // RECRUIT
    if (
      this.building &&
      (store.game.player.gold >= RECRUIT_COST || ignoreGold) &&
      (this.building.type !== 'TOWER' || this.building.hp !== HP.TOWER)
    ) {
      return 'RECRUIT'
    }

    // CASTLE
    if (
      this.building &&
      this.building.type === 'TOWER' &&
      (store.game.player.gold >= CASTLE_COST || ignoreGold)
    ) {
      return 'CASTLE'
    }

    return null
  }

  captureCost() {
    if (!store.gsConfig) return 1

    const { CAPTURE_COST } = store.gsConfig

    if (this.forest) {
      return CAPTURE_COST.FOREST
    } else if (this.mountain) {
      return CAPTURE_COST.MOUNTAIN
    } else {
      return CAPTURE_COST.DEFAULT
    }
  }

  setBuilding(newBuilding: Building) {
    this.building = newBuilding
  }

  createAttentionNotification() {
    if (!store.game || !store.game.pixi) return

    const pixel = getPixelPosition(this.axial)
    const circle = new PIXI.Graphics()
    circle.zIndex = ATTENTION_NOTIFICATION_Z_INDEX

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
}

export default Tile
