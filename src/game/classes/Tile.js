import * as PIXI from 'pixi.js'
import game from '../../game'
import Animation from './Animation'
import getPixelPosition from '../functions/getPixelPosition'
import getImageAnimation from '../functions/getImageAnimation'
import createImage from '../functions/createImage'
import invertHexDirection from '../functions/invertHexDirection'
import hex from '../functions/hex'
import getRotationBySide from '../functions/getRotationBySide'
import {
  NEIGHBOR_DIRECTIONS,
  TILE_IMAGES,
  ARMY_ICON_OFFSET_Y,
  HITPOINTS_OFFSET_Y,
  HEART_OFFSET_X,
} from '../constants'

class Tile {
  constructor({
    x,
    z,
    owner,
    mountain,
    forest,
    capital,
    castle,
    village,
    camp,
    hitpoints,
  }) {
    this.x = x
    this.z = z
    this.owner = owner
    this.castle = castle
    this.mountain = mountain
    this.forest = forest
    this.capital = capital
    this.village = village
    this.camp = camp
    this.hitpoints = hitpoints
    this.neighbors = [null, null, null, null, null, null]
    this.image = {}
    this.army = null
    this.hitpointsVisible = false

    const position = getPixelPosition(x, z)

    this.image.background = createImage('background', 'pattern')
    this.image.background.tint = hex('#eee')

    this.image.highlight = createImage('highlight', 'pattern')
    this.image.highlight.alpha = 0.22
    this.image.highlight.visible = false

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

    if (hitpoints !== null) {
      this.addHitpoints(hitpoints)
    }

    if (owner) {
      this.image.pattern = createImage('pattern')
      this.image.pattern.tint = hex(owner.pattern)
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
    this.capital = true
    this.addImage('capital')
  }
  addCastle() {
    this.castle = true
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

    new Animation({
      speed: 0.05,
      image,
      context: { stage: game.stage[imageName] },
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

    for (let i = 0; i < game.armies.length; i++) {
      if (game.armies[i].tile === this) {
        game.armies[i].moveOn(this)
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
  updateHitpoints(hitpoints) {
    if (hitpoints === null) return

    const { hearts } = this.image

    if (hitpoints === 2 && this.hitpoints < 2) {
      new Animation({
        image: hearts[1],
        onUpdate: (image, fraction) => {
          image.alpha = fraction
        },
      })

      setTimeout(() => {
        if (!this.isHovered() && this.hitpoints === 2) {
          this.hideHitpoints()
        }
      }, 800)
    } else if (hitpoints < 2 && this.hitpoints === 2) {
      new Animation({
        image: hearts[1],
        onUpdate: (image, fraction) => {
          image.alpha = 1 - fraction
        },
      })
    }

    if (hitpoints < 2) {
      this.showHitpoints()
    }

    this.hitpoints = hitpoints
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
  setOwner(owner) {
    const { x, z } = this

    if (owner) {
      if (this.image.pattern) {
        game.stage['pattern'].removeChild(this.image.pattern)
      }

      const position = getPixelPosition(x, z)

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
  addHighlight() {
    this.image.highlight.visible = true
  }
  clearHighlight() {
    this.image.highlight.visible = false
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
  updateNeighbors(tiles) {
    let missingNeighbors = []

    for (let i = 0; i < 6; i++) {
      if (!this.neighbors[i]) {
        missingNeighbors.push(i)
      }
    }

    if (!missingNeighbors.length) return

    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i]

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
      if (!this.neighbors[i]) continue

      if (this.neighbors[i].owner !== this.owner) {
        this.image.border[i].visible = true
      } else if (
        !this.owner &&
        game.tilesWithPatternPreview.includes(this) &&
        !game.tilesWithPatternPreview.includes(this.neighbors[i])
      ) {
        this.image.border[i].visible = true
      } else {
        this.image.border[i].visible = false
      }
    }
  }
  isHovered() {
    return game.hoveredTile === this
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
    let neighborPlayers = []

    for (let i = 0; i < 6; i++) {
      const n = this.neighbors[i]

      if (n && n.owner && !neighborPlayers.includes(n.owner)) {
        neighborPlayers.push(n.owner)
      }
    }

    return neighborPlayers.length >= 2
  }
  getStructureName() {
    let structure = 'Plains'

    if (this.mountain) {
      structure = 'Mountains'
    } else if (this.forest) {
      structure = 'Forest'
    } else if (this.castle) {
      structure = 'Castle'
    } else if (this.capital) {
      structure = 'Capital'
    } else if (this.camp) {
      structure = 'Camp'
    } else if (this.village) {
      structure = 'Village'
    }

    return structure
  }
}

export default Tile
