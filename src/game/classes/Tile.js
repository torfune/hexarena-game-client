import * as PIXI from 'pixi.js'
import game from '../../game'
import Animation from './Animation'
import getPixelPosition from '../functions/getPixelPosition'
import getImageAnimation from '../functions/getImageAnimation'
import createImage from '../functions/createImage'
import invertHexDirection from '../functions/invertHexDirection'
import hex from '../functions/hex'
import getRotationBySide from '../functions/getRotationBySide'
import store from '../../store'
import {
  NEIGHBOR_DIRECTIONS,
  TILE_IMAGES,
  ARMY_ICON_OFFSET_Y,
  HITPOINTS_OFFSET_Y,
  HEART_OFFSET_X,
  BEDROCK_BACKGROUND,
  BEDROCK_BORDER,
} from '../constants'

class Tile {
  constructor({
    id,
    x,
    z,
    ownerId,
    camp,
    capital,
    castle,
    forest,
    mountain,
    village,
    bedrock,
    hitpoints,
  }) {
    this.id = id
    this.x = x
    this.z = z
    this.ownerId = ownerId
    this.camp = camp
    this.capital = capital
    this.castle = castle
    this.forest = forest
    this.mountain = mountain
    this.village = village
    this.bedrock = bedrock
    this.hitpoints = hitpoints

    this.previous = {}
    this.owner = ownerId ? store.getItem('players', ownerId) : null
    this.army = null
    this.hitpointsVisible = false
    this.image = {}
    this.neighbors = [null, null, null, null, null, null]

    const position = getPixelPosition(x, z)

    this.image.background = createImage('background', 'pattern')
    this.image.background.tint = hex('#eee')

    this.image.blackOverlay = createImage('blackOverlay')
    this.image.blackOverlay.alpha = 0.2
    this.image.blackOverlay.visible = false

    this.image.contested = createImage('contested')
    this.image.contested.visible = false

    this.image.fog = []
    for (let i = 0; i < 6; i++) {
      this.image.fog[i] = createImage('fog')
      this.image.fog[i].rotation = getRotationBySide(i)
      this.image.fog[i].visible = false
    }

    this.image.border = []
    for (let i = 0; i < 6; i++) {
      this.image.border[i] = createImage('border')
      this.image.border[i].rotation = getRotationBySide(i)
      this.image.border[i].visible = false
    }

    this.image.arrow = []
    for (let i = 0; i < 6; i++) {
      this.image.arrow[i] = createImage('arrow')
      this.image.arrow[i].rotation = getRotationBySide(i)
      this.image.arrow[i].visible = false
    }

    if (capital) {
      this.image.capital = createImage('capital')
    }

    if (castle) {
      this.image.castle = createImage('castle')
    }

    if (village) {
      this.image.village = createImage('village')
    }

    if (camp) {
      this.image.camp = createImage('camp')
    }

    if (mountain) {
      this.image.mountain = createImage('mountain')
    }

    if (forest) {
      this.image.forest = createImage('forest')
    }

    if (bedrock) {
      this.image.background.tint = hex(BEDROCK_BACKGROUND)
    }

    if (hitpoints !== null) {
      this.addHitpoints(hitpoints)
    }

    if (this.owner) {
      this.image.pattern = createImage('pattern')
      this.image.pattern.tint = hex(this.owner.pattern)
    }

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      const image = this.image[TILE_IMAGES[i]]

      if (!image) continue

      if (image instanceof Array) {
        for (let j = 0; j < 6; j++) {
          image[j].x = position.x
          image[j].y = position.y
          image[j].scale.x = game.scale
          image[j].scale.y = game.scale
        }
      } else {
        image.x = position.x
        image.y = position.y
        image.scale.x = game.scale
        image.scale.y = game.scale
      }
    }
  }
  set(key, value) {
    this.previous[key] = this[key]
    this[key] = value

    switch (key) {
      case 'capital':
      case 'castle':
      case 'camp':
      case 'village':
      case 'forest':
        this.updateImage(key)
        break

      case 'ownerId':
        this.changeOwner(value)
        break

      case 'hitpoints':
        if (!this.previous.hitpoints && this.hitpoints) {
          this.addHitpoints(this.hitpoints)
        } else if (this.previous.hitpoints && !this.hitpoints) {
          this.removeHitpoints()
        } else {
          this.updateHitpoints(this.hitpoints)
        }
        break

      default:
        break
    }
  }
  updateImage(key) {
    if (this[key] && !this.image[key]) {
      this.addImage(key)
    } else {
      this.removeImage(key)
    }
  }
  updateBlackOverlay() {
    if (this.mountain && this.owner) {
      this.image.blackOverlay.visible = true
    } else {
      this.image.blackOverlay.visible = false
    }
  }
  startHover() {
    if (this.hitpoints === 2 && !this.army) {
      this.showHitpoints()
    }
  }
  endHover() {
    if (this.hitpoints === 2 && !this.army && this.hitpointsVisible) {
      this.hideHitpoints()
    }
  }
  updateScale() {
    const position = getPixelPosition(this.x, this.z)

    for (let i = 0; i < TILE_IMAGES.length; i++) {
      const imageName = TILE_IMAGES[i]
      const image = this.image[imageName]

      if (!image) continue

      if (imageName === 'armyIcon' || imageName === 'hitpointsBg') {
        image.x = position.x
        image.scale.x = game.scale
        image.scale.y = game.scale

        const animation = getImageAnimation(image)

        if (animation) {
          animation.context.baseY = position.y
        } else {
          image.y = position.y - ARMY_ICON_OFFSET_Y * game.scale
        }

        continue
      }

      if (image instanceof Array) {
        for (let j = 0; j < 6; j++) {
          image[j].x = position.x
          image[j].y = position.y
          image[j].scale.x = game.scale
          image[j].scale.y = game.scale
        }
      } else {
        image.x = position.x
        image.y = position.y
        image.scale.x = game.scale
        image.scale.y = game.scale
      }
    }
  }
  addImage(imageName) {
    const position = getPixelPosition(this.x, this.z)

    this.image[imageName] = createImage(imageName)
    this.image[imageName].x = position.x
    this.image[imageName].y = position.y
    this.image[imageName].scale.x = game.scale
    this.image[imageName].scale.y = game.scale
    this.image[imageName].alpha = 0

    new Animation({
      speed: 0.1,
      image: this.image[imageName],
      onUpdate: (image, fraction) => {
        image.alpha = fraction
      },
    })
  }
  addCapital() {
    this.addImage('capital')
  }
  addCastle() {
    this.addImage('castle')
  }
  addForest() {
    this.forest = true
    this.addImage('forest')
  }
  addVillage() {
    this.village = true
    this.addImage('village')
  }
  addCamp() {
    this.camp = true
    this.addImage('camp')
  }
  addArmy(army) {
    if (this.army) return

    if (this.hitpointsVisible) {
      this.hideHitpoints()
    }

    this.army = army

    const position = getPixelPosition(this.x, this.z)

    this.image.armyIcon = createImage('armyIcon')
    this.image.armyIcon.x = position.x
    this.image.armyIcon.y = position.y
    this.image.armyIcon.scale.x = game.scale
    this.image.armyIcon.scale.y = game.scale
    this.image.armyIcon.alpha = 0

    new Animation({
      speed: 0.05,
      image: this.image.armyIcon,
      context: { baseY: position.y },
      onUpdate: (image, fraction, context) => {
        image.alpha = fraction
        image.y = context.baseY - ARMY_ICON_OFFSET_Y * game.scale * fraction
      },
    })
  }
  addHitpoints(hitpoints) {
    this.hitpoints = hitpoints

    const position = getPixelPosition(this.x, this.z)
    const fillTexture = PIXI.loader.resources['hitpointsFill'].texture

    this.image.hitpointsBg = createImage('hitpointsBg')
    this.image.hitpointsBg.x = position.x
    this.image.hitpointsBg.y = position.y
    this.image.hitpointsBg.scale.x = game.scale
    this.image.hitpointsBg.scale.y = game.scale
    this.image.hitpointsBg.alpha = 0

    this.image.hearts = [
      new PIXI.Sprite(fillTexture),
      new PIXI.Sprite(fillTexture),
    ]

    this.image.hearts[0].anchor.set(0.5, 0.5)
    this.image.hearts[1].anchor.set(0.5, 0.5)

    this.image.hearts[1].x += HEART_OFFSET_X

    this.image.hitpointsBg.addChild(this.image.hearts[0])
    this.image.hitpointsBg.addChild(this.image.hearts[1])
  }
  addContested() {
    this.image.contested.visible = true
  }
  removeContested() {
    this.image.contested.visible = false
  }
  removeImage(imageName) {
    const image = this.image[imageName]

    if (!image) return

    delete this.image[imageName]

    new Animation({
      speed: 0.05,
      image,
      context: {
        stage: game.stage[imageName],
      },
      onUpdate: (image, fraction) => {
        image.alpha = 1 - fraction
      },
      onFinish: (image, context) => {
        context.stage.removeChild(image)
      },
    })
  }
  removeCapital() {
    this.capital = false

    setTimeout(() => {
      this.removeImage('capital')
    }, 400)
  }
  removeCastle() {
    this.castle = false

    setTimeout(() => {
      this.removeImage('castle')
    }, 400)
  }
  removeForest() {
    this.forest = false
    this.removeImage('forest')
  }
  removeVillage() {
    this.village = false
    this.removeImage('village')
  }
  removeCamp() {
    this.camp = false

    for (let i = 0; i < store.armies.length; i++) {
      if (store.armies[i].tile === this) {
        store.armies[i].moveOn(this)
      }
    }

    setTimeout(() => {
      this.removeImage('camp')
    }, 200)
  }
  removeArmy() {
    this.army = null

    const position = getPixelPosition(this.x, this.z)

    new Animation({
      speed: 0.05,
      image: this.image.armyIcon,
      context: {
        stage: game.stage['armyIcon'],
        baseY: position.y,
      },
      onUpdate: (image, fraction, context) => {
        fraction = 1 - fraction

        image.alpha = fraction
        image.y = context.baseY - ARMY_ICON_OFFSET_Y * game.scale * fraction
      },
      onFinish: (image, context) => {
        context.stage.removeChild(image)
      },
    })
  }
  removeHitpoints() {
    this.hitpoints = null

    new Animation({
      image: this.image.hearts[0],
      onUpdate: (image, fraction) => {
        image.alpha = 1 - fraction
      },
    })

    setTimeout(() => {
      this.removeImage('hitpointsBg')
    }, 500)
  }
  updateHitpoints() {
    if (this.hitpoints === null) return

    const { hearts } = this.image

    if (this.hitpoints === 2 && this.previous.hitpoints < 2) {
      new Animation({
        image: hearts[1],
        onUpdate: (image, fraction) => {
          image.alpha = fraction
        },
      })

      setTimeout(() => {
        if (!this.isHovered()) {
          this.hideHitpoints()
        }
      }, 800)
    } else if (this.hitpoints < 2 && this.previous.hitpoints === 2) {
      new Animation({
        image: hearts[1],
        onUpdate: (image, fraction) => {
          image.alpha = 1 - fraction
        },
      })
    }

    if (this.hitpoints < 2) {
      this.showHitpoints()
    }
  }
  showHitpoints() {
    if (this.hitpointsVisible) return

    this.hitpointsVisible = true

    const position = getPixelPosition(this.x, this.z)
    const animation = getImageAnimation(this.image.hitpointsBg)

    let initialFraction = null

    if (animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    new Animation({
      speed: 0.05,
      image: this.image.hitpointsBg,
      initialFraction,
      context: { baseY: position.y },
      onUpdate: (image, fraction, context) => {
        image.alpha = fraction
        image.y = context.baseY - HITPOINTS_OFFSET_Y * game.scale * fraction
      },
    })
  }
  hideHitpoints() {
    if (!this.hitpointsVisible) return

    this.hitpointsVisible = false

    const position = getPixelPosition(this.x, this.z)
    const animation = getImageAnimation(this.image.hitpointsBg)

    let initialFraction = null

    if (animation) {
      initialFraction = 1 - animation.fraction
      animation.destroy()
    }

    new Animation({
      speed: 0.05,
      initialFraction,
      image: this.image.hitpointsBg,
      context: { baseY: position.y },
      onUpdate: (image, fraction, context) => {
        fraction = 1 - fraction

        image.alpha = fraction
        image.y = context.baseY - HITPOINTS_OFFSET_Y * game.scale * fraction
      },
    })
  }
  changeOwner(ownerId) {
    const owner = ownerId ? store.getItem('players', ownerId) : null

    if (owner) {
      if (this.image.pattern) {
        game.stage['pattern'].removeChild(this.image.pattern)
      }

      const position = getPixelPosition(this.x, this.z)

      this.image.pattern = createImage('pattern')
      this.image.pattern.tint = hex(owner.pattern)
      this.image.pattern.x = position.x
      this.image.pattern.y = position.y
      this.image.pattern.scale.x = game.scale
      this.image.pattern.scale.y = game.scale
      this.image.pattern.alpha = 0

      game.animations.push(
        new Animation({
          image: this.image.pattern,
          onUpdate: (image, fraction) => {
            image.alpha = fraction
          },
        })
      )
    } else if (this.owner) {
      game.stage['pattern'].removeChild(this.image.pattern)
      this.image.pattern = null
    }

    this.owner = owner
  }
  selectArmy() {
    if (!this.image.pattern) return

    this.image.pattern.tint = hex('#fff')

    for (let i = 0; i < 6; i++) {
      const n = this.neighbors[i]
      const direction = invertHexDirection(i)

      if (n) {
        n.image.arrow[direction].visible = true
      }
    }

    const armyTargetTiles = []
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
      const direction = invertHexDirection(i)

      if (n) {
        n.image.arrow[direction].visible = false
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
          tile.x === this.x + NEIGHBOR_DIRECTIONS[direction].x &&
          tile.z === this.z + NEIGHBOR_DIRECTIONS[direction].z
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
      if (!this.neighbors[i]) {
        this.image.fog[i].visible = true
      } else {
        this.image.fog[i].visible = false
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
      if (this.owner && n.owner && this.owner.id !== n.owner.id) {
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

      this.image.border[i].visible = showBorder
      this.image.border[i].tint = borderTint ? hex(borderTint) : hex('#fff')
    }
  }
  isHovered() {
    return store.hoveredTile && store.hoveredTile.id === this.id
  }
  isEmpty() {
    return (
      !this.castle &&
      !this.capital &&
      !this.forest &&
      !this.camp &&
      !this.village &&
      !this.mountain
    )
  }
  addPatternPreview(pattern) {
    if (this.image.pattern) {
      this.image.pattern.visible = false
    }

    const position = getPixelPosition(this.x, this.z)

    this.image.patternPreview = createImage('patternPreview', 'pattern')
    this.image.patternPreview.x = position.x
    this.image.patternPreview.y = position.y
    this.image.patternPreview.tint = hex(pattern)
    this.image.patternPreview.scale.x = game.scale
    this.image.patternPreview.scale.y = game.scale
    this.image.patternPreview.alpha = 0.5
  }
  removePatternPreview() {
    if (this.image.pattern) {
      this.image.pattern.visible = true
    }

    game.stage['patternPreview'].removeChild(this.image.patternPreview)
  }
  isContested() {
    let neighborPlayersIds = []

    for (let i = 0; i < 6; i++) {
      const n = this.neighbors[i]

      if (n && n.owner && !neighborPlayersIds.includes(n.owner.id)) {
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
    } else if (this.capital) {
      return 'Capital'
    } else if (this.camp) {
      return 'Camp'
    } else if (this.village) {
      return 'Village'
    }

    return 'Plains'
  }
}

export default Tile
