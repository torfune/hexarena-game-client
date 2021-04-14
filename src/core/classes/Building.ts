import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import Tile from './Tile'
import { Sprite } from 'pixi.js-legacy'
import createImage from '../functions/createImage'
import getPixelPosition from '../functions/getPixelPosition'
import shuffle from '../../utils/shuffle'
import destroyImage from '../functions/destroyImage'
import store from '../store'
import Animation from './Animation'
import BuildingType from '../../types/BuildingType'
import {
  HP_BACKGROUND_OFFSET,
  HP_FILL_OFFSET_X,
  HP_FILL_OFFSET_Y,
  IMAGE_Z_INDEX,
} from '../../constants/constants-game'
import getTexture from '../functions/getTexture'
import getImageAnimation from '../functions/getImageAnimation'
import Army from './Army'
import SoundManager from '../../services/SoundManager'
import { ActionType } from './Action'

class Building {
  readonly id: string
  readonly tile: Tile
  hp: number
  type: BuildingType
  army: Army | null = null
  image: Sprite

  constructor(id: string, tile: Tile, type: BuildingType, hp: number) {
    this.id = id
    this.tile = tile
    this.type = type
    this.hp = hp
    this.image = createImage(this.getTextureName(), { axialZ: tile.axial.z })

    const pixel = getPixelPosition(tile.axial)
    this.image.x = pixel.x
    this.image.y = pixel.y
    this.image.scale.set(0)
    this.image.alpha = 0

    new Animation(
      this.image,
      (image, fraction) => {
        image.scale.set(fraction)
        image.alpha = fraction
      },
      { speed: 0.05 }
    )

    if (store.game) {
      store.game.buildings.set(id, this)

      if (store.game.pixi) {
        store.game.pixi.stage.addChild(this.image)
      }
    }
  }

  setHp(hp: number) {
    this.hp = hp
  }

  setType(newType: BuildingType) {
    this.type = newType
    this.image.texture = getTexture(this.getTextureName())
  }
  //
  // getMaxHp() {
  //   if (!store.gsConfig) return
  //
  //   const { HP } = store.gsConfig
  //
  //   switch (this.type) {
  //     case 'CAPITAL':
  //       return HP.CAPITAL
  //     case 'CAMP':
  //       return HP.CAMP
  //     case 'TOWER':
  //       return HP.TOWER
  //     case 'CASTLE':
  //       return HP.CASTLE
  //   }
  // }

  // updateHitpoints() {
  //   const { gsConfig } = store
  //   if (!gsConfig) return
  //
  //   // Remove
  //   if (!this.building) {
  //     this.removeImage('hp-background')
  //     return
  //   }
  //
  //   // Add
  //   if (!this.image['hp-background']) {
  //     const pixel = getPixelPosition(this.axial)
  //     const image = createImage(
  //       `hp-background-${this.building.type === 'CASTLE' ? '3' : '2'}`,
  //       { zIndex: IMAGE_Z_INDEX.indexOf('hp-background') }
  //     )
  //     image.x = pixel.x
  //     image.y = pixel.y
  //     image.alpha = 0
  //     this.image['hp-background'] = image
  //
  //     const fillTexture = getTexture('hp-fill')
  //     this.image['hp-fill-1'] = new Sprite(fillTexture)
  //     this.image['hp-fill-2'] = new Sprite(fillTexture)
  //     this.image['hp-fill-3'] = new Sprite(fillTexture)
  //     this.image['hp-fill-1'].anchor.set(0.5, 0.5)
  //     this.image['hp-fill-2'].anchor.set(0.5, 0.5)
  //     this.image['hp-fill-3'].anchor.set(0.5, 0.5)
  //     this.image['hp-fill-1'].y = HP_FILL_OFFSET_Y * -1
  //     this.image['hp-fill-2'].y = HP_FILL_OFFSET_Y * -1
  //     this.image['hp-fill-3'].y = HP_FILL_OFFSET_Y * -1
  //     if (this.building.type === 'CASTLE') {
  //       this.image['hp-fill-1'].x = HP_FILL_OFFSET_X * 2 * -1
  //       this.image['hp-fill-3'].x = HP_FILL_OFFSET_X * 2
  //     } else {
  //       this.image['hp-fill-1'].x = HP_FILL_OFFSET_X * -1
  //       this.image['hp-fill-2'].x = HP_FILL_OFFSET_X
  //       this.image['hp-fill-3'].visible = false
  //     }
  //     image.addChild(this.image['hp-fill-1'])
  //     image.addChild(this.image['hp-fill-2'])
  //     image.addChild(this.image['hp-fill-3'])
  //
  //     if (
  //       this.building.hp !== gsConfig.HP[this.building.type] ||
  //       (this.isHovered() && !this.army)
  //     ) {
  //       this.showHitpoints()
  //     }
  //   }
  //
  //   // Upgrade
  //   if (this.building.type === 'CASTLE') {
  //     this.image['hp-background'].texture = getTexture('hp-background-3')
  //
  //     if (
  //       this.building.hp !== gsConfig.HP[this.building.type] ||
  //       (this.isHovered() && !this.army)
  //     ) {
  //       this.showHitpoints()
  //     }
  //
  //     if (
  //       this.image['hp-fill-1'] &&
  //       this.image['hp-fill-2'] &&
  //       this.image['hp-fill-3']
  //     ) {
  //       this.image['hp-fill-1'].x = HP_FILL_OFFSET_X * 2 * -1
  //       this.image['hp-fill-2'].x = 0
  //       this.image['hp-fill-3'].x = HP_FILL_OFFSET_X * 2
  //       this.image['hp-fill-3'].visible = true
  //     }
  //   }
  //
  //   // Update
  //   if (
  //     !this.image['hp-fill-1'] ||
  //     !this.image['hp-fill-2'] ||
  //     !this.image['hp-fill-3']
  //   ) {
  //     return
  //   }
  //
  //   if (this.building.hp < gsConfig.HP[this.building.type]) {
  //     this.showHitpoints()
  //   }
  //
  //   switch (this.building.hp) {
  //     case 0:
  //       this.image['hp-fill-1'].visible = false
  //       this.image['hp-fill-2'].visible = false
  //       this.image['hp-fill-3'].visible = false
  //       break
  //     case 1:
  //       this.image['hp-fill-1'].visible = true
  //       this.image['hp-fill-2'].visible = false
  //       this.image['hp-fill-3'].visible = false
  //       break
  //     case 2:
  //       this.image['hp-fill-1'].visible = true
  //       this.image['hp-fill-2'].visible = true
  //       this.image['hp-fill-3'].visible = false
  //       break
  //     case 3:
  //       this.image['hp-fill-1'].visible = true
  //       this.image['hp-fill-2'].visible = true
  //       this.image['hp-fill-3'].visible = true
  //       break
  //   }
  //
  //   if (
  //     this.building.hp === gsConfig.HP[this.building.type] &&
  //     !this.isHovered()
  //   ) {
  //     setTimeout(
  //       () => {
  //         if (
  //           this.building &&
  //           this.building.hp === gsConfig.HP[this.building.type] &&
  //           !this.isHovered()
  //         ) {
  //           this.hideHitpoints()
  //         }
  //       },
  //       // }).bind(this),
  //       500
  //     )
  //   }
  // }

  // showHitpoints() {
  //   if (this.hpVisible || !this.image['hp-background'] || !this.building) {
  //     return
  //   }
  //
  //   this.hpVisible = true
  //
  //   const building = this.building
  //   const pixel = getPixelPosition(this.axial)
  //   const animation = getImageAnimation(this.image['hp-background'])
  //
  //   let initialFraction: number | undefined = undefined
  //   if (animation && animation instanceof Animation) {
  //     initialFraction = 1 - animation.fraction
  //     animation.destroy()
  //   }
  //
  //   new Animation(
  //     this.image['hp-background'],
  //     (image, fraction, context) => {
  //       image.alpha = fraction
  //       image.y = context.baseY - HP_BACKGROUND_OFFSET[building.type] * fraction
  //     },
  //     {
  //       context: { baseY: pixel.y },
  //       initialFraction,
  //       speed: 0.05,
  //     }
  //   )
  // }

  // hideHitpoints() {
  //   if (!this.hpVisible || !this.building || !this.image['hp-background']) {
  //     return
  //   }
  //
  //   this.hpVisible = false
  //
  //   const building = this.building
  //   const pixel = getPixelPosition(this.axial)
  //   const animation = getImageAnimation(this.image['hp-background'])
  //
  //   let initialFraction
  //   if (animation && animation instanceof Animation) {
  //     initialFraction = 1 - animation.fraction
  //     animation.destroy()
  //   }
  //
  //   new Animation(
  //     this.image['hp-background'],
  //     (image, fraction, context) => {
  //       fraction = 1 - fraction
  //       image.alpha = fraction
  //       image.y = context.baseY - HP_BACKGROUND_OFFSET[building.type] * fraction
  //     },
  //     {
  //       context: { baseY: pixel.y },
  //       initialFraction,
  //       speed: 0.05,
  //     }
  //   )
  // }

  setArmy(newArmy: Army | null) {
    if (this.tile.owner && this.tile.owner?.id === store.game?.playerId) {
      SoundManager.play('ARMY_ARRIVE')
    }

    this.army = newArmy
  }

  getTextureName() {
    switch (this.type) {
      case 'CAPITAL':
        return 'capital'
      case 'CAMP':
        return 'camp'
      case 'TOWER':
        return 'tower'
      case 'CASTLE':
        return 'castle'
    }
  }

  destroy() {
    if (!store.game) return

    store.game.buildings.delete(this.id)

    if (this.tile.building === this) {
      this.tile.building = null
    }

    destroyImage(this.image)
  }
}

export default Building
