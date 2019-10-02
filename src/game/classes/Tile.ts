import getPixelPosition from '../functions/pixelFromAxial'
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
  HP_HEIGHT,
  ARMY_ICON_UPDATE_RATE,
} from '../../constants/game'
import getImageAnimation from '../functions/getImageAnimation'
import shade from '../../utils/shade'
import Player from './Player'
import { Animation } from '../functions/animate'
import TileImage from '../../types/TileImage'
import { Axial } from '../../types/coordinates'
import Action from './Action'
import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import TileImageArray from '../../types/TileImageArray'
import { Sprite, Loader, Graphics } from 'pixi.js'
import getRotationBySide from '../functions/getRotationBySide'
import destroyImage from '../functions/destroyImage'
import axialInDirection from '../../utils/axialInDirection'
import getTileByAxial from '../functions/getTileByAxial'
import BuildingType from '../../types/BuildingType'
import Forest from './Forest'
import Village from './Village'
import SoundManager from '../../SoundManager'
import animate from '../functions/animate'

const loader = Loader.shared

interface Props {
  [key: string]: Prop<Primitive>
  camp: Prop<boolean>
  buildingHp: Prop<number | null>
  buildingType: Prop<BuildingType | null>
  ownerId: Prop<string | null>
  productionAt: Prop<number | null>
}

class Tile {
  props: Props = {
    camp: createProp(false),
    buildingHp: createProp(null),
    buildingType: createProp(null),
    ownerId: createProp(null),
    productionAt: createProp(null),
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
  armyIconUpdateTimeout: NodeJS.Timeout | null = null
  armyIconUnitCount = {
    current: 0,
    target: 0,
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

  updateProps(props: string[]) {
    if (!store.game) return

    for (let i = 0; i < props.length; i++) {
      switch (props[i]) {
        case 'ownerId':
          this.updateOwner()
          break
        case 'camp':
          if (this.camp && !this.image.camp) {
            const camp = this.addImage('camp')
            camp.anchor.set(0.5, 1)
            camp.y += 60
          } else if (!this.camp && this.image.camp) {
            this.removeImage('camp')
          }
          break
        case 'buildingType':
          const type = this.building ? this.building.type : null
          if (type === 'CAPITAL') {
            if (!this.image.capital) {
              const capital = this.addImage('capital')
              capital.y -= 10
            }
          } else if (type === 'CASTLE') {
            if (!this.image.castle) {
              this.addImage('castle')
              this.removeImage('tower')
            }
          } else if (type === 'TOWER') {
            if (!this.image.tower) {
              const tower = this.addImage('tower')
              tower.anchor.set(0.5, 1)
              tower.y += 60
            }
          } else if (type === null) {
            this.removeImage('capital')
            this.removeImage('tower')
            this.removeImage('castle')
            this.hideProgressBar()
          }
          this.updateHitpoints()
          break
        case 'buildingHp':
          this.updateHitpoints()
          break
        case 'productionAt':
          if (this.productionAt) {
            const { productionTiles } = store.game
            if (!productionTiles.includes(this)) {
              productionTiles.push(this)
            }

            if (this.hpVisible) {
              this.showProgressBar()
            }
          } else {
            const { productionTiles } = store.game
            const index = productionTiles.indexOf(this)
            if (index !== -1) {
              productionTiles.splice(index, 1)
            }

            this.updateProduction()
            this.hideProgressBar()
          }
          break
      }
    }

    // Sounds
    // if (
    //   this.ownerId === store.game.playerId &&
    //   ((key === 'camp' && value) || (key === 'buildingType' && value))
    // ) {
    //   SoundManager.play('BUILDING')
    // }
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
    if (!gsConfig) return

    if (
      this.hpVisible &&
      this.building &&
      this.building.hp === gsConfig.HP[this.building.type]
    ) {
      this.hideHitpoints()
    }

    this.army = army
    this.armyIconUnitCount = {
      current: 0,
      target: 0,
    }
    this.showArmyIcon()

    // const structure = this.building
    //   ? this.building.type.toLowerCase()
    //   : this.camp
    //   ? 'camp'
    //   : 'NO_STRUCTURE'
    // this.army.log(`join ${structure}`)
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
  addImage(key: keyof TileImage, doAnimate = true) {
    if (Date.now() - this.createdAt < 500) {
      doAnimate = false
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

    if (doAnimate) {
      image.alpha = 0
      image.scale.set(0)
      animate({
        image,
        duration: 250,
        onUpdate: (image, fraction) => {
          image.alpha = fraction
          image.scale.set(fraction)
        },
      })
    }

    return image
  }
  removeImage(key: keyof TileImage, doAnimate = true) {
    const image = this.image[key]

    if (!image || !store.game) return

    delete this.image[key]

    if (doAnimate) {
      const delay =
        key === 'tower' || key === 'castle' || key === 'capital' ? 500 : 0
      animate({
        image,
        duration: 500,
        delay,
        context: store.game.stage.get(key),
        onUpdate: (image, fraction) => {
          image.alpha = 1 - fraction
          image.scale.set(1 - fraction)
        },
        onFinish: (image, stage) => {
          if (stage) {
            stage.removeChild(image)
          }
        },
      })
    } else {
      const stage = store.game.stage.get(key)
      if (stage) {
        stage.removeChild(image)
      }
    }
  }
  removeArmy() {
    if (!this.army || !store.game) return

    // const structure = this.building
    //   ? this.building.type.toLowerCase()
    //   : this.camp
    //   ? 'camp'
    //   : 'NO_STRUCTURE'
    // this.army.log(`left ${structure}`)

    this.army = null

    if (store.game.selectedArmyTile === this) {
      this.unselectArmy()
    } else {
      this.hideArmyIcon()
      this.updateArmyIcon()
    }
  }
  showArmyIcon() {
    const pixel = getPixelPosition(this.axial)

    if (!this.image.armyIcon) {
      // Background
      this.image.armyIcon = createImage('armyIcon', `armyIcon0`)
      this.image.armyIcon.x = pixel.x
      this.image.armyIcon.y = pixel.y
      this.image.armyIcon.alpha = 0

      // Fill
      const { texture } = loader.resources['armyIconFill']
      this.image.armyIconFill = new Sprite(texture)
      this.image.armyIconFill.anchor.set(0.5, 0.5)
      this.image.armyIconFill.y = -38
      this.image.armyIcon.addChild(this.image.armyIconFill)

      // Mask
      const mask = new Graphics()
      this.image.armyIconFill.mask = mask
      this.image.armyIcon.addChild(mask)
      this.updateProduction()
    }

    let yOffset: number = ARMY_ICON_OFFSET_Y.CAMP
    if (this.building) {
      switch (this.building.type) {
        case 'TOWER':
          yOffset = ARMY_ICON_OFFSET_Y.TOWER
          break
        case 'CASTLE':
          yOffset = ARMY_ICON_OFFSET_Y.CASTLE
          break
        case 'CAPITAL':
          yOffset = ARMY_ICON_OFFSET_Y.CAPITAL
          break
      }
    }

    animate({
      image: this.image.armyIcon,
      duration: 400,
      ease: 'OUT',
      onUpdate: (image, fraction) => {
        image.alpha = fraction
        image.y = pixel.y - yOffset * fraction
        image.scale.set(fraction)
      },
    })

    this.hideProgressBar(true)
    this.updateArmyIcon()
  }
  hideArmyIcon() {
    if (!this.image.armyIcon) return

    let yOffset: number = ARMY_ICON_OFFSET_Y.CAMP
    if (this.building) {
      switch (this.building.type) {
        case 'TOWER':
          yOffset = ARMY_ICON_OFFSET_Y.TOWER
          break
        case 'CASTLE':
          yOffset = ARMY_ICON_OFFSET_Y.CASTLE
          break
        case 'CAPITAL':
          yOffset = ARMY_ICON_OFFSET_Y.CAPITAL
          break
      }
    }

    const position = getPixelPosition(this.axial)
    animate({
      image: this.image.armyIcon,
      duration: 400,
      ease: 'IN',
      onUpdate: (image, fraction) => {
        image.alpha = 1 - fraction
        image.y = position.y - yOffset * (1 - fraction)
        image.scale.set(1 - fraction)
      },
      // TODO: remove image from stage
      // onFinish: image => {
      //   if (!store.game) return
      //   const stage = store.game.stage.get('armyIcon')
      //   if (stage) {
      //     stage.removeChild(image)
      //   }
      // },
    })
  }
  updateArmyIcon() {
    if (!this.image.armyIcon) return

    this.armyIconUnitCount.target = this.army ? this.army.unitCount : 0

    if (this.armyIconUpdateTimeout) {
      clearTimeout(this.armyIconUpdateTimeout)
      this.armyIconUpdateTimeout = null
    }

    const { current, target } = this.armyIconUnitCount

    const change = current < target ? 1 : -1
    const newCurrent = this.armyIconUnitCount.current + change
    this.armyIconUnitCount.current = newCurrent

    if (newCurrent !== target) {
      this.armyIconUpdateTimeout = setTimeout(
        this.updateArmyIcon.bind(this),
        ARMY_ICON_UPDATE_RATE
      )
    }

    const resource = loader.resources[`armyIcon${newCurrent}`]
    if (!resource) return
    this.image.armyIcon.texture = resource.texture
  }
  updateHitpoints() {
    const { gsConfig } = store
    if (!gsConfig) return

    // Hide
    if (!this.building) {
      setTimeout(() => {
        if (!this.building) {
          this.hideHitpoints()
        }
      }, 500)
      return
    }

    // Create
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
      this.showProgressBar()
    } else {
      this.hideProgressBar()
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
      this.hideHitpoints()
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

    animate({
      image: this.image.hpBackground,
      duration: 400,
      initialFraction,
      ease: 'OUT',
      onUpdate: (image, fraction) => {
        image.alpha = fraction
        image.y = pixel.y - HP_BACKGROUND_OFFSET[building.type] * fraction
        image.scale.set(fraction)
      },
    })
  }
  hideHitpoints() {
    if (!this.hpVisible || !this.image.hpBackground) return

    this.hpVisible = false

    const building = this.building
    const pixel = getPixelPosition(this.axial)
    const animation = getImageAnimation(this.image.hpBackground)

    let initialFraction
    if (animation && animation instanceof Animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    let hpOffset = 0
    if (building) {
      hpOffset = HP_BACKGROUND_OFFSET[building.type]
    } else if (this.props.buildingType.previous) {
      hpOffset = HP_BACKGROUND_OFFSET[this.props.buildingType.previous]
    }

    animate({
      image: this.image.hpBackground,
      duration: 400,
      initialFraction,
      ease: 'IN',
      context: this,
      onUpdate: (image, fraction) => {
        image.alpha = 1 - fraction
        image.y = pixel.y - hpOffset * (1 - fraction)
        image.scale.set(1 - fraction)
      },
      onFinish: (_, tile: Tile) => {
        if (!tile.building) {
          tile.removeImage('hpBackground', false)
        }
      },
    })
  }
  showProgressBar() {
    if (
      !store.game ||
      !store.gsConfig ||
      !this.building ||
      this.image.progressBar ||
      this.building.hp === store.gsConfig.HP[this.building.type] ||
      this.building.hp === 0
    ) {
      return
    }

    const building = this.building
    const pixel = getPixelPosition(this.axial)
    const yOffset = HP_BACKGROUND_OFFSET[building.type] + HP_HEIGHT

    // Background
    this.image.progressBar = createImage('progressBar')
    this.image.progressBar.x = pixel.x
    this.image.progressBar.y = pixel.y - yOffset
    this.image.progressBar.alpha = 0

    // Fill
    const { texture } = loader.resources['progressBarFill']
    this.image.progressBarFill = new Sprite(texture)
    this.image.progressBarFill.anchor.set(0.5, 0.5)
    this.image.progressBar.addChild(this.image.progressBarFill)

    // Mask
    const mask = new Graphics()
    this.image.progressBarFill.mask = mask
    this.image.progressBar.addChild(mask)
    this.updateProduction()

    // Animation
    animate({
      image: this.image.progressBar,
      duration: 200,
      ease: 'OUT',
      onUpdate: (image, fraction) => {
        image.alpha = fraction
      },
    })
  }
  hideProgressBar(instantly: boolean = false) {
    if (!store.game || !this.image.progressBar) return

    const destroyImage = (image: Sprite) => {
      if (!store.game) return
      const stage = store.game.stage.get('progressBar')
      if (stage) {
        stage.removeChild(image)
      }
    }

    if (instantly) {
      destroyImage(this.image.progressBar)
    } else {
      animate({
        image: this.image.progressBar,
        duration: 200,
        ease: 'IN',
        onUpdate: (image, fraction) => {
          image.alpha = 1 - fraction
        },
        onFinish: destroyImage,
      })
    }

    this.image.progressBar = undefined
  }
  updateProduction() {
    if (!store.game || !store.gsConfig) return

    let fraction = 1

    if (this.productionAt) {
      const timeDelta = this.productionAt + store.game.timeDiff - Date.now()
      fraction = 1 - timeDelta / store.gsConfig.PRODUCTION_RATE
    }

    if (fraction > 1) {
      fraction = 1
    } else if (fraction < 0) {
      fraction = 0
    }

    if (this.image.armyIconFill) {
      const mask = this.image.armyIconFill.mask as Graphics
      const height = 60 * fraction
      mask.clear()
      mask.beginFill(hex('#0000ff'))
      mask.drawRect(-17, -8 - height, 34, height)
      mask.endFill()
    }

    if (this.image.progressBarFill) {
      if (this.hasFullHp()) {
        fraction = 1
      }

      const mask = this.image.progressBarFill.mask as Graphics
      mask.clear()
      mask.beginFill(hex('#0000ff'))
      mask.drawRect(-27, -2, 54 * fraction, 4)
      mask.endFill()
    }
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
        animate({
          image,
          duration: 1000,
          delay: Math.round(Math.random() * 100),
          initialFraction: 0.6,
          onUpdate: (image, fraction) => {
            image.alpha = fraction
            image.scale.set(fraction)
          },
        })
      }
    } else {
      if (this.image.pattern) {
        const patternImage = this.image.pattern
        setTimeout(() => {
          if (this.image.pattern === patternImage) {
            animate({
              image: this.image.pattern,
              duration: 400,
              onUpdate: (image, fraction) => {
                image.alpha = 1 - fraction
                image.scale.set(1 - fraction)
              },
              onFinish: image => {
                destroyImage('pattern', image)
              },
            })
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
    if (!this.image.pattern || !store.game || !this.army || !store.gsConfig) {
      return
    }

    const armyTargetTiles: Tile[][] = []
    for (let i = 0; i < 6; i++) {
      armyTargetTiles[i] = []

      const nextTile = this.neighbors[i]
      if (nextTile) {
        armyTargetTiles[i].push(nextTile)
      }

      let lastTile = armyTargetTiles[i][armyTargetTiles[i].length - 1]
      let steps = this.army.unitCount
      while (steps > 0) {
        const nextTile = lastTile.neighbors[i]
        if (!nextTile) break

        lastTile = nextTile
        armyTargetTiles[i].push(nextTile)

        if (nextTile.ownerId !== store.game.playerId) {
          steps--
        }
      }
    }

    this.hideArmyIcon()
    this.army.leaveBuilding()
    store.game.selectedArmyTargetTiles = armyTargetTiles
  }
  unselectArmy() {
    if (!store.game || !store.game.selectedArmyTile) return

    if (store.game.armyDragArrow) {
      store.game.armyDragArrow.destroy(false)
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
        newImage.tint = borderTint ? hex(borderTint) : hex('#333')

        if (!patternPreview && now - this.createdAt > 500) {
          newImage.alpha = 0
          animate({
            image: newImage,
            duration: 200,
            ease: 'IN',
            onUpdate: (image, fraction) => {
              image.alpha = fraction
            },
          })
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
  getActionType(ignoreGold: boolean = false) {
    if (!store.game || !store.gsConfig || this.action || !store.game.player) {
      return null
    }

    const { CAMP_COST, TOWER_COST, CASTLE_COST } = store.gsConfig

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
      return this.forest.treeCount * CAPTURE_COST.TREE
    } else if (this.mountain) {
      return CAPTURE_COST.MOUNTAIN
    } else {
      return CAPTURE_COST.DEFAULT
    }
  }
  hasFullHp() {
    if (!this.building || !store.gsConfig) return false

    const { HP } = store.gsConfig
    return this.building.hp === HP[this.building.type]
  }
  clearArmyIconUnitCount() {
    this.armyIconUnitCount = {
      current: 0,
      target: 0,
    }
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
  get productionAt() {
    return this.props.productionAt.current
  }
}

export default Tile
