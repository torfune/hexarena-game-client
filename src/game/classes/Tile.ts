import getPixelPosition from '../functions/getPixelPosition'
import Army from './Army'
import store from '../../store'
import createImage from '../functions/createImage'
import hex from '../functions/hex'
import {
  ARMY_ICON_OFFSET_Y,
  HEART_OFFSET_X,
  HITPOINTS_OFFSET_Y,
  NEIGHBOR_DIRECTIONS,
  BEDROCK_BORDER,
  BEDROCK_BACKGROUND,
} from '../../constants/game'
import game from '..'
import GoldAnimation from './GoldAnimation'
import getImageAnimation from '../functions/getImageAnimation'
import shade from '../../utils/shade'
import Player from './Player'
import Animation from './Animation'
import invertHexDirection from '../functions/invertHexDirection'
import TileImage from '../../types/TileImage'
import { Axial } from '../../types/coordinates'
import Action from './Action'
import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import TileImageArray from '../../types/TileImageArray'
import { Sprite, Loader } from 'pixi.js'
import getRotationBySide from '../functions/getRotationBySide'
import destroyImage from '../functions/destroyImage'

const loader = Loader.shared

interface Props {
  [key: string]: Prop<Primitive>
  base: Prop<boolean>
  camp: Prop<boolean>
  castle: Prop<boolean>
  forest: Prop<boolean>
  hitpoints: Prop<number | null>
  ownerId: Prop<string | null>
  village: Prop<boolean>
}

class Tile {
  props: Props = {
    base: createProp(false),
    camp: createProp(false),
    castle: createProp(false),
    forest: createProp(false),
    hitpoints: createProp(null),
    ownerId: createProp(null),
    village: createProp(false),
  }

  readonly id: string
  readonly axial: Axial
  readonly bedrock: boolean
  readonly mountain: boolean
  action: Action | null = null
  owner: Player | null = null
  army: Army | null = null
  hitpointsVisible: boolean = false
  neighbors: Tile[] = []
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

    // this.image.background = createImage('background', 'pattern')

    // this.image.blackOverlay.alpha = 0.18
    // this.image.blackOverlay.visible = false
    // this.image.contested.visible = false

    if (mountain) {
      this.addImage('mountain')
    }

    // this.imageSet.fog = []
    // for (let i = 0; i < 6; i++) {
    //   this.imageSet.fog[i] = createImage('fog')
    //   this.imageSet.fog[i].rotation = getRotationBySide(i)
    //   this.imageSet.fog[i].visible = false
    // }

    // this.imageSet.border = []
    // for (let i = 0; i < 6; i++) {
    //   this.imageSet.border[i] = createImage('border')
    //   this.imageSet.border[i].rotation = getRotationBySide(i)
    //   this.imageSet.border[i].visible = false
    // }

    // this.imageSet.arrow = []
    // for (let i = 0; i < 6; i++) {
    //   this.imageSet.arrow[i] = createImage('arrow')
    //   this.imageSet.arrow[i].rotation = getRotationBySide(i)
    //   this.imageSet.arrow[i].visible = false
    // }

    this.updateOwner()
    this.updateScale()
  }

  setProp(key: keyof Props, value: Primitive) {
    this.props[key].previous = this.props[key].current
    this.props[key].current = value

    switch (key) {
      case 'base':
      case 'castle':
      case 'camp':
      case 'village':
      case 'forest':
        this.updateImage(key)

        if (key === 'forest' && !value && this.ownerId === store.playerId) {
          new GoldAnimation(this, 2)
        }

        break

      case 'ownerId':
        this.updateOwner()
        break

      case 'hitpoints':
        if (!this.props.hitpoints.previous && this.hitpoints) {
          this.addHitpoints()
        } else if (this.props.hitpoints.previous && !this.hitpoints) {
          this.removeHitpoints()
        } else {
          this.updateHitpoints()
        }
        break

      default:
        break
    }
  }

  updateImage(key: keyof TileImage) {
    if (this.props[key].current && !this.image[key]) {
      this.addImage(key)
    } else {
      this.removeImage(key)
    }
  }
  updateBlackOverlay() {
    // if (this.mountain && this.owner) {
    //   this.image.blackOverlay.visible = true
    // } else {
    //   this.image.blackOverlay.visible = false
    // }
  }
  startHover() {
    if (this.hitpoints === 2 && !this.army) {
      this.showHitpoints()
    }

    if (this.canPlayerCreateAction() && game.selectedArmyTile !== this) {
      this.addHighlight()
    }
  }
  endHover() {
    if (this.hitpoints === 2 && !this.army && this.hitpointsVisible) {
      this.hideHitpoints()
    }

    if (this.owner && game.selectedArmyTile !== this) {
      this.removeHighlight()
    }
  }
  updateScale() {
    // const pixel = getPixelPosition(this.axial)
    // const imageKeys = Object.keys(this.image) as Array<keyof TileImage>
    // for (let i = 0; i < imageKeys.length; i++) {
    //   const key = imageKeys[i]
    //   const image = this.image[key]
    //   if (!image) continue
    //   if (key === 'armyIcon' || key === 'hitpointsBg') {
    //     image.x = pixel.x
    //     image.scale.x = game.scale
    //     image.scale.y = game.scale
    //     const animation = getImageAnimation(image)
    //     if (animation && animation instanceof Animation) {
    //       animation.context.baseY = pixel.y
    //     } else {
    //       image.y = pixel.y - ARMY_ICON_OFFSET_Y * game.scale
    //     }
    //     continue
    //   }
    //   image.x = pixel.x
    //   image.y = pixel.y
    //   image.scale.x = game.scale
    //   image.scale.y = game.scale
    // }
    // const imageSetKeys = Object.keys(this.imageSet) as Array<
    //   keyof TileImageArray
    // >
    // for (let i = 0; i < imageSetKeys.length; i++) {
    //   const key = imageSetKeys[i]
    //   const imageSet = this.imageSet[key]
    //   for (let j = 0; j < 6; j++) {
    //     if (!imageSet[j]) continue
    //     imageSet[j].x = pixel.x
    //     imageSet[j].y = pixel.y
    //     imageSet[j].scale.x = game.scale
    //     imageSet[j].scale.y = game.scale
    //   }
    // }
  }
  addHighlight() {
    if (!this.owner || !this.image.pattern) return

    this.image.pattern.tint = hex(shade(this.owner.pattern, 10))
  }
  addArmy(army: Army) {
    if (this.army) return

    if (this.hitpointsVisible) {
      this.hideHitpoints()
    }

    this.army = army

    const pixel = getPixelPosition(this.axial)

    this.image.armyIcon = createImage('armyIcon')
    this.image.armyIcon.x = pixel.x
    this.image.armyIcon.y = pixel.y
    // this.image.armyIcon.scale.x = game.scale
    // this.image.armyIcon.scale.y = game.scale
    this.image.armyIcon.alpha = 0

    new Animation(
      this.image.armyIcon,
      (image, fraction, context) => {
        image.alpha = fraction
        image.y = context.baseY - ARMY_ICON_OFFSET_Y * /*game.scale **/ fraction
      },
      { context: { baseY: pixel.y }, speed: 0.05 }
    )
  }
  addHitpoints() {
    const pixel = getPixelPosition(this.axial)
    const fillTexture = loader.resources['hitpointsFill'].texture

    this.image.hitpointsBg = createImage('hitpointsBg')
    this.image.hitpointsBg.x = pixel.x
    this.image.hitpointsBg.y = pixel.y
    // this.image.hitpointsBg.scale.x = game.scale
    // this.image.hitpointsBg.scale.y = game.scale
    this.image.hitpointsBg.alpha = 0

    this.image.heartLeft = new Sprite(fillTexture)
    this.image.heartRight = new Sprite(fillTexture)
    this.image.heartRight.x += HEART_OFFSET_X

    this.image.heartLeft.anchor.set(0.5, 0.5)
    this.image.heartRight.anchor.set(0.5, 0.5)

    this.image.hitpointsBg.addChild(this.image.heartLeft)
    this.image.hitpointsBg.addChild(this.image.heartRight)
  }
  addContested() {
    // this.image.contested.visible = true
  }
  removeHighlight() {
    if (!this.owner || !this.image.pattern) return

    this.image.pattern.tint = hex(this.owner.pattern)
  }
  removeContested() {
    // this.image.contested.visible = false
  }
  addImage(key: keyof TileImage, animate = true) {
    const texture = key === 'background' ? 'pattern' : key
    const pixel = getPixelPosition(this.axial)
    const image = createImage(key, texture)

    image.x = pixel.x
    image.y = pixel.y
    this.image[key] = image

    if (animate) {
      image.alpha = 0
      new Animation(image, (image: Sprite, fraction: number) => {
        image.alpha = fraction
      })
    }

    return image
  }
  removeImage(key: keyof TileImage, animate = true) {
    const image = this.image[key]

    if (!image) return

    delete this.image[key]

    if (animate) {
      new Animation(
        image,
        (image, fraction) => {
          image.alpha = 1 - fraction
        },
        {
          context: {
            stage: game.stage[key],
          },
          onFinish: (image, context) => {
            context.stage.removeChild(image)
          },
          speed: 0.05,
        }
      )
    } else {
      game.stage[key].removeChild(image)
    }
  }
  removeArmy() {
    if (!this.army || !this.image.armyIcon) {
      throw Error('Can not remove non existing army')
    }

    this.army = null

    const position = getPixelPosition(this.axial)

    new Animation(
      this.image.armyIcon,
      (image, fraction, context) => {
        fraction = 1 - fraction

        image.alpha = fraction
        image.y = context.baseY - ARMY_ICON_OFFSET_Y * game.scale * fraction
      },
      {
        context: {
          stage: game.stage['armyIcon'],
          baseY: position.y,
        },
        onFinish: (image, context) => {
          context.stage.removeChild(image)
        },
        speed: 0.05,
      }
    )
  }
  removeHitpoints() {
    if (!this.image.heartLeft || !this.image.heartRight) return

    new Animation(this.image.heartLeft, (image, fraction) => {
      image.alpha = 1 - fraction
    })

    setTimeout(() => {
      this.removeImage('hitpointsBg')
    }, 500)
  }
  updateHitpoints() {
    if (!this.hitpoints || !this.image.heartLeft || !this.image.heartRight)
      return

    const previousHitpoints = this.props.hitpoints.previous

    if (this.hitpoints === 2 && (!previousHitpoints || previousHitpoints < 2)) {
      new Animation(this.image.heartRight, (image, fraction) => {
        image.alpha = fraction
      })

      setTimeout(() => {
        if (!this.isHovered()) {
          this.hideHitpoints()
        }
      }, 800)
    } else if (this.hitpoints < 2 && previousHitpoints === 2) {
      new Animation(this.image.heartRight, (image, fraction) => {
        image.alpha = 1 - fraction
      })
    }

    if (this.hitpoints < 2) {
      this.showHitpoints()
    }
  }
  showHitpoints() {
    if (this.hitpointsVisible) return

    // TODO: temp fix of crash, investigate further
    if (!this.image.hitpointsBg) return

    this.hitpointsVisible = true

    const pixel = getPixelPosition(this.axial)
    const animation = getImageAnimation(this.image.hitpointsBg)

    let initialFraction
    if (animation && animation instanceof Animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    new Animation(
      this.image.hitpointsBg,
      (image, fraction, context) => {
        image.alpha = fraction
        image.y = context.baseY - HITPOINTS_OFFSET_Y * fraction
      },
      {
        context: { baseY: pixel.y },
        initialFraction,
        speed: 0.05,
      }
    )
  }
  hideHitpoints() {
    if (!this.hitpointsVisible) return

    // TODO: temp fix of crash, investigate further
    if (!this.image.hitpointsBg) return

    this.hitpointsVisible = false

    const pixel = getPixelPosition(this.axial)
    const animation = getImageAnimation(this.image.hitpointsBg)

    let initialFraction
    if (animation && animation instanceof Animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    new Animation(
      this.image.hitpointsBg,
      (image, fraction, context) => {
        fraction = 1 - fraction

        image.alpha = fraction
        image.y = context.baseY - HITPOINTS_OFFSET_Y * fraction
      },
      {
        context: { baseY: pixel.y },
        initialFraction,
        speed: 0.05,
      }
    )
  }
  updateOwner() {
    const newOwner = this.ownerId ? store.getPlayer(this.ownerId) : null

    if (newOwner) {
      if (this.image.pattern) {
        this.removeImage('pattern')
      }

      if (this.image.background) {
        this.removeImage('background')
      }

      const image = this.addImage('pattern', false)
      image.alpha = 0
      image.tint = hex(newOwner.pattern)

      game.animations.push(
        new Animation(
          image,
          (image, fraction) => {
            image.alpha = fraction
          },
          {
            initialFraction: 0.4,
            speed: 0.01,
          }
        )
      )
    } else {
      if (this.image.pattern) {
        this.removeImage('pattern')
      }

      // Create Background
      if (!this.image.background) {
        const image = this.addImage('background')

        if (this.bedrock) {
          image.tint = hex(BEDROCK_BACKGROUND)
        }
      }
    }

    this.owner = newOwner
  }
  selectArmy() {
    if (!this.image.pattern) return

    this.image.pattern.tint = hex('#fff')

    for (let i = 0; i < 6; i++) {
      const n = this.neighbors[i]

      if (!n) continue

      const direction = invertHexDirection(i)
      const image = n.imageSet.arrow[direction]

      if (!image) {
        const pixel = getPixelPosition(n.axial)
        const newImage = createImage('arrow')
        newImage.x = pixel.x
        newImage.y = pixel.y
        newImage.rotation = getRotationBySide(direction)
        n.imageSet.arrow[direction] = newImage
      }
    }

    const armyTargetTiles: Tile[][] = []
    for (let i = 0; i < 6; i++) {
      let nextTile = this.neighbors[i]
      armyTargetTiles[i] = []

      if (!nextTile) continue

      armyTargetTiles[i].push(nextTile)

      for (let j = 0; j < 3; j++) {
        const lastTile = armyTargetTiles[i][armyTargetTiles[i].length - 1]
        nextTile = lastTile.neighbors[i]

        if (!nextTile) break

        armyTargetTiles[i].push(nextTile)
      }
    }

    game.selectedArmyTargetTiles = armyTargetTiles
  }
  unselectArmy() {
    if (!this.image.pattern || !this.owner) return

    this.image.pattern.tint = hex(this.owner.pattern)

    for (let i = 0; i < 6; i++) {
      const n = this.neighbors[i]

      if (!n) continue

      const direction = invertHexDirection(i)
      const image = n.imageSet.arrow[direction]

      if (image) {
        destroyImage('arrow', image)
        n.imageSet.arrow[direction] = null
      }
    }
  }
  updateNeighbors() {
    let missingNeighbors = []

    for (let i = 0; i < 6; i++) {
      if (!this.neighbors[i]) {
        missingNeighbors.push(i)
      }
    }

    if (!missingNeighbors.length) return

    for (let i = 0; i < store.tiles.length; i++) {
      const tile = store.tiles[i]

      for (let j = 0; j < missingNeighbors.length; j++) {
        const direction = missingNeighbors[j]

        if (
          tile.axial.x === this.axial.x + NEIGHBOR_DIRECTIONS[direction].x &&
          tile.axial.z === this.axial.z + NEIGHBOR_DIRECTIONS[direction].z
        ) {
          this.neighbors[direction] = tile
          break
        }
      }
    }

    this.updateFogs()
  }
  updateFogs() {
    for (let i = 0; i < 6; i++) {
      const image = this.imageSet.fog[i]

      if (!this.neighbors[i] && !image) {
        const pixel = getPixelPosition(this.axial)
        const newImage = createImage('fog')

        newImage.x = pixel.x
        newImage.y = pixel.y
        newImage.rotation = getRotationBySide(i)

        this.imageSet.fog[i] = newImage
      } else if (this.neighbors[i] && image) {
        destroyImage('fog', image)
        this.imageSet.fog[i] = null
      }
    }
  }
  updateBorders() {
    for (let i = 0; i < 6; i++) {
      const n = this.neighbors[i]

      if (!n) continue

      let showBorder = false
      let borderTint = null

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
        game.tilesWithPatternPreview.includes(this) &&
        !n.owner &&
        !game.tilesWithPatternPreview.includes(n)
      ) {
        showBorder = true
      }

      // Preview -> Owned
      if (
        game.tilesWithPatternPreview.includes(this) &&
        n.owner &&
        !game.tilesWithPatternPreview.includes(n)
      ) {
        showBorder = true
      }

      const image = this.imageSet.border[i]
      if (showBorder && !image) {
        const pixel = getPixelPosition(this.axial)
        const newImage = createImage('border')

        newImage.x = pixel.x
        newImage.y = pixel.y
        newImage.rotation = getRotationBySide(i)
        newImage.tint = borderTint ? hex(borderTint) : hex('#fff')

        this.imageSet.border[i] = newImage
      } else if (!showBorder && image) {
        destroyImage('border', image)
        this.imageSet.border[i] = null
      }

      // this.imageSet.border[i].visible = showBorder
      // this.imageSet.border[i].tint = borderTint ? hex(borderTint) : hex('#fff')
    }
  }
  isHovered() {
    return store.hoveredTile && store.hoveredTile.id === this.id
  }
  isEmpty() {
    return (
      !this.castle &&
      !this.base &&
      !this.forest &&
      !this.camp &&
      !this.village &&
      !this.mountain
    )
  }
  addPatternPreview(pattern: string) {
    if (this.image.pattern) {
      this.image.pattern.visible = false
    }

    const pixel = getPixelPosition(this.axial)

    this.image.patternPreview = createImage('patternPreview', 'pattern')
    this.image.patternPreview.x = pixel.x
    this.image.patternPreview.y = pixel.y
    this.image.patternPreview.tint = hex(pattern)
    // this.image.patternPreview.scale.x = game.scale
    // this.image.patternPreview.scale.y = game.scale
    this.image.patternPreview.alpha = 0.5
  }
  removePatternPreview() {
    if (!this.image.patternPreview) return

    if (this.image.pattern) {
      this.image.pattern.visible = true
    }

    game.stage['patternPreview'].removeChild(this.image.patternPreview)
  }
  isContested() {
    if (!store.player) return false

    let neighborPlayersIds: string[] = []

    for (let i = 0; i < 6; i++) {
      const n = this.neighbors[i]

      if (
        n &&
        n.owner &&
        n.ownerId !== store.player.allyId &&
        !neighborPlayersIds.includes(n.owner.id)
      ) {
        neighborPlayersIds.push(n.owner.id)
      }
    }

    return neighborPlayersIds.length >= 2
  }
  getStructureName() {
    if (this.bedrock) {
      return 'Edge of the World'
    } else if (this.mountain) {
      return 'Mountains'
    } else if (this.forest) {
      return 'Forest'
    } else if (this.castle) {
      return 'Castle'
    } else if (this.base) {
      return 'Base'
    } else if (this.camp) {
      return 'Camp'
    } else if (this.village) {
      return 'Village'
    }

    return 'Plains'
  }
  canPlayerCreateAction() {
    if (!store.player || store.gold === undefined || !store.gsConfig) {
      return false
    }

    if (
      !this.owner ||
      this.owner.id !== store.player.id ||
      this.mountain ||
      this.village ||
      game.selectedArmyTile
    ) {
      return false
    }

    // Recruit
    if (
      (this.castle || this.base) &&
      store.gold >= store.gsConfig.RECRUIT_COST
    ) {
      return true
    }

    // Build
    if (this.isEmpty() && store.gold >= store.gsConfig.BUILD_COST) {
      return true
    }

    // Send army
    if (this.army) {
      return true
    }

    // Cut gold
    if (this.forest) {
      return true
    }

    return false
  }

  // Prop getters
  get base() {
    return this.props.base.current
  }
  get camp() {
    return this.props.camp.current
  }
  get castle() {
    return this.props.castle.current
  }
  get forest() {
    return this.props.forest.current
  }
  get hitpoints() {
    return this.props.hitpoints.current
  }
  get ownerId() {
    return this.props.ownerId.current
  }
  get village() {
    return this.props.village.current
  }
}

export default Tile
