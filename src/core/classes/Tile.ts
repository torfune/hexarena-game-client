import getPixelPosition from '../functions/getPixelPosition'
import Army from './Army'
import store from '../../store'
import createImage from '../functions/createImage'
import hex from '../functions/hex'
import {
  ARMY_ICON_OFFSET_Y,
  BEDROCK_BORDER,
  BEDROCK_BACKGROUND,
  HP_FILL_OFFSET_X,
  HP_FILL_OFFSET_Y,
  HP_BACKGROUND_OFFSET,
  IMAGE_OFFSET_Y,
} from '../../constants/game'
import getImageAnimation from '../functions/getImageAnimation'
import shade from '../../utils/shade'
import Player from './Player'
import Animation from './Animation'
import TileImage from '../../types/TileImage'
import { Axial } from '../../types/coordinates'
import Action from './Action'
import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import TileImageArray from '../../types/TileImageArray'
import { Sprite, Loader } from 'pixi.js-legacy'
import getRotationBySide from '../functions/getRotationBySide'
import destroyImage from '../functions/destroyImage'
import axialInDirection from '../../utils/axialInDirection'
import getTileByAxial from '../functions/getTileByAxial'
import BuildingType from '../../types/BuildingType'
import Forest from './Forest'
import Village from './Village'
import { easeInQuad } from '../functions/easing'
import SoundManager from '../../services/SoundManager'

const loader = Loader.shared

interface Props {
  [key: string]: Prop<Primitive>
  camp: Prop<boolean>
  buildingHp: Prop<number | null>
  buildingType: Prop<BuildingType | null>
  ownerId: Prop<string | null>
}

class Tile {
  props: Props = {
    camp: createProp(false),
    buildingHp: createProp(null),
    buildingType: createProp(null),
    ownerId: createProp(null),
  }

  readonly id: string
  readonly axial: Axial
  readonly bedrock: boolean
  readonly mountain: boolean
  readonly createdAt: number
  forest: Forest | null = null
  village: Village | null = null
  action: Action | null = null
  owner: Player | null = null
  army: Army | null = null
  hpVisible: boolean = false
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

    this.updateOwner()
  }

  setProp(key: keyof Props, value: Primitive) {
    if (this.props[key].current === value || !store.game) return

    this.props[key].previous = this.props[key].current
    this.props[key].current = value

    switch (key) {
      case 'ownerId':
        this.updateOwner()
        break
      case 'camp':
        if (this.camp && !this.image.camp) {
          const camp = this.addImage('camp')
          camp.anchor.set(0.5, 1)
          camp.y += IMAGE_OFFSET_Y.CAMP
        } else if (!this.camp && this.image.camp) {
          this.removeImage('camp')
        }
        break
      case 'buildingType':
        if (value === 'CAPITAL') {
          if (!this.image.capital) {
            const capital = this.addImage('capital')
            capital.y += IMAGE_OFFSET_Y.CAPITAL
          }
        } else if (value === 'CASTLE') {
          if (!this.image.castle) {
            this.removeImage('tower')
            const castle = this.addImage('castle')
            castle.anchor.set(0.5, 1)
            castle.y += IMAGE_OFFSET_Y.CASTLE
          }
        } else if (value === 'TOWER') {
          if (!this.image.tower) {
            const tower = this.addImage('tower')
            tower.anchor.set(0.5, 1)
            tower.y += IMAGE_OFFSET_Y.TOWER
          }
        } else if (value === null) {
          this.removeImage('capital')
          this.removeImage('tower')
          this.removeImage('castle')
        }
        this.updateHitpoints()
        break
      case 'buildingHp':
        this.updateHitpoints()
        if (
          this.action &&
          this.action.type === 'RECRUIT' &&
          this.action.status !== 'FINISHED' &&
          this.building &&
          this.building.type !== 'TOWER'
        ) {
          this.action.icon.texture = this.action.getIconTexture()
        }
        break
    }

    // Sounds
    if (
      this.ownerId === store.game.playerId &&
      ((key === 'camp' && value) || (key === 'buildingType' && value))
    ) {
      SoundManager.play('BUILDING')
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
    if (!store.game) return

    if (this.building && !this.army) {
      this.showHitpoints()
    }

    if (this.getActionType() && !store.game.selectedArmyTile) {
      this.addHighlight()
    }
  }
  endHover() {
    const { gsConfig, game } = store
    if (!gsConfig || !game) return

    const { building } = this
    if (building && building.hp === gsConfig.HP[building.type]) {
      this.hideHitpoints()
    }

    if (this.owner && game.selectedArmyTile !== this) {
      this.removeHighlight()
    }
  }
  addHighlight() {
    if (!this.owner || !this.image.pattern) return

    this.image.pattern.tint = hex(shade(this.owner.pattern, 10))
  }
  addArmy(army: Army) {
    const { gsConfig } = store
    if (this.army || !gsConfig) return

    if (
      this.hpVisible &&
      this.building &&
      this.building.hp === gsConfig.HP[this.building.type]
    ) {
      this.hideHitpoints()
    }

    this.army = army
    this.showArmyIcon()
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
    if (Date.now() - this.createdAt < 500) {
      animate = false
    }

    let texture: string = key
    if (key === 'background') {
      texture = 'pattern'
    } else if (key === 'mountain') {
      texture = `mountain0${Math.floor(Math.random() * 5 + 1)}`
    }

    const pixel = getPixelPosition(this.axial)
    const image = createImage(key, texture)

    image.x = pixel.x
    image.y = pixel.y
    this.image[key] = image

    if (animate) {
      image.alpha = 0
      image.scale.set(0)
      new Animation(
        image,
        (image: Sprite, fraction: number) => {
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
          context: {
            stage: store.game.stage.get(key),
          },
          onFinish: (image, context) => {
            context.stage.removeChild(image)
          },
          speed: 0.05,
        }
      )
    } else {
      const stage = store.game.stage.get(key)
      if (stage) {
        stage.removeChild(image)
      }
    }
  }
  removeArmy() {
    if (!this.army || !store.game) return

    this.army = null
    this.hideArmyIcon()

    if (store.game.selectedArmyTile === this) {
      this.unselectArmy()
    }
  }
  showArmyIcon() {
    const pixel = getPixelPosition(this.axial)

    this.image.armyIcon = createImage('armyIcon')
    this.image.armyIcon.x = pixel.x
    this.image.armyIcon.y = pixel.y
    this.image.armyIcon.alpha = 0

    new Animation(
      this.image.armyIcon,
      (image, fraction, context) => {
        image.alpha = fraction
        image.y = context.baseY - this.getArmyIconOffsetY() * fraction
      },
      { context: { baseY: pixel.y }, speed: 0.05 }
    )
  }
  hideArmyIcon() {
    if (!this.image.armyIcon) return

    const position = getPixelPosition(this.axial)
    new Animation(
      this.image.armyIcon,
      (image, fraction) => {
        fraction = 1 - fraction
        image.alpha = fraction
        image.y = position.y - this.getArmyIconOffsetY() * fraction
      },
      {
        speed: 0.05,
        onFinish: (image) => {
          if (store.game) {
            const stage = store.game.stage.get('armyIcon')
            if (stage) {
              stage.removeChild(image)
            }
          }
        },
      }
    )
  }
  updateHitpoints() {
    const { gsConfig } = store
    if (!gsConfig) return

    // Remove
    if (!this.building) {
      this.removeImage('hpBackground')
      return
    }

    // Add
    if (!this.image.hpBackground) {
      const pixel = getPixelPosition(this.axial)
      const image = createImage(
        'hpBackground',
        `hpBackground${this.building.type === 'CASTLE' ? '3' : '2'}`
      )
      image.x = pixel.x
      image.y = pixel.y
      image.alpha = 0
      this.image.hpBackground = image

      const fillTexture = loader.resources['hpFill'].texture
      this.image.hpFill1 = new Sprite(fillTexture)
      this.image.hpFill2 = new Sprite(fillTexture)
      this.image.hpFill3 = new Sprite(fillTexture)
      this.image.hpFill1.anchor.set(0.5, 0.5)
      this.image.hpFill2.anchor.set(0.5, 0.5)
      this.image.hpFill3.anchor.set(0.5, 0.5)
      this.image.hpFill1.y = HP_FILL_OFFSET_Y * -1
      this.image.hpFill2.y = HP_FILL_OFFSET_Y * -1
      this.image.hpFill3.y = HP_FILL_OFFSET_Y * -1
      if (this.building.type === 'CASTLE') {
        this.image.hpFill1.x = HP_FILL_OFFSET_X * 2 * -1
        this.image.hpFill3.x = HP_FILL_OFFSET_X * 2
      } else {
        this.image.hpFill1.x = HP_FILL_OFFSET_X * -1
        this.image.hpFill2.x = HP_FILL_OFFSET_X
        this.image.hpFill3.visible = false
      }
      image.addChild(this.image.hpFill1)
      image.addChild(this.image.hpFill2)
      image.addChild(this.image.hpFill3)

      if (
        this.building.hp !== gsConfig.HP[this.building.type] ||
        (this.isHovered() && !this.army)
      ) {
        this.showHitpoints()
      }
    }

    // Upgrade
    if (this.building.type === 'CASTLE') {
      const { texture } = loader.resources['hpBackground3']
      this.image.hpBackground.texture = texture

      if (
        this.building.hp !== gsConfig.HP[this.building.type] ||
        (this.isHovered() && !this.army)
      ) {
        this.showHitpoints()
      }

      if (this.image.hpFill1 && this.image.hpFill2 && this.image.hpFill3) {
        this.image.hpFill1.x = HP_FILL_OFFSET_X * 2 * -1
        this.image.hpFill2.x = 0
        this.image.hpFill3.x = HP_FILL_OFFSET_X * 2
        this.image.hpFill3.visible = true
      }
    }

    // Update
    if (!this.image.hpFill1 || !this.image.hpFill2 || !this.image.hpFill3) {
      return
    }

    if (this.building.hp < gsConfig.HP[this.building.type]) {
      this.showHitpoints()
    }

    switch (this.building.hp) {
      case 0:
        this.image.hpFill1.visible = false
        this.image.hpFill2.visible = false
        this.image.hpFill3.visible = false
        break
      case 1:
        this.image.hpFill1.visible = true
        this.image.hpFill2.visible = false
        this.image.hpFill3.visible = false
        break
      case 2:
        this.image.hpFill1.visible = true
        this.image.hpFill2.visible = true
        this.image.hpFill3.visible = false
        break
      case 3:
        this.image.hpFill1.visible = true
        this.image.hpFill2.visible = true
        this.image.hpFill3.visible = true
        break
    }

    if (
      this.building.hp === gsConfig.HP[this.building.type] &&
      !this.isHovered()
    ) {
      setTimeout(
        (() => {
          if (
            this.building &&
            this.building.hp === gsConfig.HP[this.building.type] &&
            !this.isHovered()
          ) {
            this.hideHitpoints()
          }
        }).bind(this),
        500
      )
    }
  }
  showHitpoints() {
    if (this.hpVisible || !this.image.hpBackground || !this.building) {
      return
    }

    this.hpVisible = true

    const building = this.building
    const pixel = getPixelPosition(this.axial)
    const animation = getImageAnimation(this.image.hpBackground)

    let initialFraction: number | undefined = undefined
    if (animation && animation instanceof Animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    new Animation(
      this.image.hpBackground,
      (image, fraction, context) => {
        image.alpha = fraction
        image.y = context.baseY - HP_BACKGROUND_OFFSET[building.type] * fraction
      },
      {
        context: { baseY: pixel.y },
        initialFraction,
        speed: 0.05,
      }
    )
  }
  hideHitpoints() {
    if (!this.hpVisible || !this.building || !this.image.hpBackground) {
      return
    }

    this.hpVisible = false

    const building = this.building
    const pixel = getPixelPosition(this.axial)
    const animation = getImageAnimation(this.image.hpBackground)

    let initialFraction
    if (animation && animation instanceof Animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    new Animation(
      this.image.hpBackground,
      (image, fraction, context) => {
        fraction = 1 - fraction
        image.alpha = fraction
        image.y = context.baseY - HP_BACKGROUND_OFFSET[building.type] * fraction
      },
      {
        context: { baseY: pixel.y },
        initialFraction,
        speed: 0.05,
      }
    )
  }
  updateOwner() {
    if (!store.game) return

    const newOwner = this.ownerId
      ? store.game.players.get(this.ownerId) || null
      : null
    if (newOwner) {
      if (this.image.pattern) {
        this.removeImage('pattern')
      }

      if (this.image.background) {
        this.removeImage('background')
      }

      const image = this.addImage('pattern', false)
      image.tint = hex(newOwner.pattern)

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
                  destroyImage('pattern', image)
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
        }
      }
    }

    if (store.game.selectedArmyTile === this) {
      this.unselectArmy()
    }

    this.owner = newOwner

    // Set camera to capital
    if (!store.game.spawnTile && this.ownerId === store.game.playerId) {
      store.game.spawnTile = this
    } else if (!store.game.spawnTile && store.spectating) {
      store.game.spawnTile = this
    }
  }
  selectArmy() {
    if (!this.image.pattern || !store.game || !this.army || !store.gsConfig)
      return

    const armyTargetTiles: Tile[][] = []
    for (let i = 0; i < 6; i++) {
      armyTargetTiles[i] = []

      const nextTile = this.neighbors[i]
      if (nextTile) {
        armyTargetTiles[i].push(nextTile)
      }

      for (let j = 1; j < store.gsConfig.ARMY_RANGE; j++) {
        const lastTile = armyTargetTiles[i][armyTargetTiles[i].length - 1]
        const nextTile = lastTile.neighbors[i]
        if (!nextTile) break

        armyTargetTiles[i].push(nextTile)
      }
    }

    this.hideArmyIcon()
    this.army.leaveBuilding()
    store.game.selectedArmyTargetTiles = armyTargetTiles
  }
  unselectArmy() {
    if (!store.game || !store.game.selectedArmyTile) return

    if (store.game.armyDragArrow) {
      store.game.armyDragArrow.destroy()
    }

    if (this.image.pattern && this.owner) {
      this.image.pattern.tint = hex(this.owner.pattern)
    }

    for (let i = 0; i < 6; i++) {
      const armyTiles = store.game.selectedArmyTargetTiles[i]
      for (let j = 0; j < armyTiles.length; j++) {
        armyTiles[j].removeHighlight()
      }
    }

    if (this.army) {
      this.showArmyIcon()
      this.army.joinBuilding()
    }

    store.game.selectedArmyTile = null
    store.game.updatePatternPreviews()
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
    if (!store.game) return

    const now = Date.now()

    for (let i = 0; i < 6; i++) {
      const n = this.neighbors[i]

      if (!n) continue

      let showBorder = false
      let patternPreview = false
      let borderTint = '#333'

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
        destroyImage('border', image)
        this.imageSet.border[i] = null
      }
    }
  }
  isHovered() {
    if (!store.game) return false
    return store.game.hoveredTile && store.game.hoveredTile.id === this.id
  }
  isEmpty() {
    return (
      !this.building &&
      !this.forest &&
      !this.village &&
      !this.mountain &&
      !this.camp
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
    this.image.patternPreview.alpha = 0.3
  }
  removePatternPreview() {
    if (!this.image.patternPreview || !store.game) return

    if (this.image.pattern) {
      this.image.pattern.visible = true
    }

    const stage = store.game.stage.get('patternPreview')
    if (stage) {
      stage.removeChild(this.image.patternPreview)
    }
  }
  getStructureName() {
    if (this.bedrock) {
      return 'Edge of the World'
    } else if (this.mountain) {
      return 'Mountains'
    } else if (this.forest) {
      return 'Forest'
    } else if (this.camp) {
      return 'Camp'
    } else if (this.building) {
      if (this.building.type === 'TOWER') {
        return 'Tower'
      } else if (this.building.type === 'CASTLE') {
        return 'Castle'
      } else if (this.building.type === 'CAPITAL') {
        return 'Capital'
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
      if (n && n.ownerId === store.game.playerId) {
        isNeighbor = true
        break
      }
    }

    // CAPTURE
    if (
      isNeighbor &&
      !this.owner &&
      (store.game.player.gold >= this.captureCost() || ignoreGold)
    ) {
      return 'CAPTURE'
    }

    if (this.ownerId !== store.game.playerId) return null

    // CAMP
    const forestGold = this.forest ? this.forest.treeCount : 0
    if (
      (this.isEmpty() || this.forest) &&
      (store.game.player.gold >= CAMP_COST - forestGold || ignoreGold)
    ) {
      return 'CAMP'
    }

    // TOWER
    if (this.camp && (store.game.player.gold >= TOWER_COST || ignoreGold)) {
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
  getArmyIconOffsetY() {
    if (this.building) {
      return ARMY_ICON_OFFSET_Y[this.building.type]
    } else if (this.camp) {
      return ARMY_ICON_OFFSET_Y.CAMP
    }

    return 0
  }

  // Prop getters
  get ownerId() {
    return this.props.ownerId.current
  }
  get building() {
    const type = this.props.buildingType.current
    const hp = this.props.buildingHp.current
    if (type === null || hp === null) {
      return null
    }
    return { type, hp }
  }
  get camp() {
    return this.props.camp.current
  }
}

export default Tile