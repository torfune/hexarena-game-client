import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import Tile from './Tile'
import { Sprite } from 'pixi.js'
import createImage from '../functions/createImage'
import getPixelPosition from '../functions/getPixelPosition'
import shuffle from '../../utils/shuffle'
import destroyImage from '../functions/destroyImage'
import store from '../../store'
import Animation from '../classes/Animation'

const HOUSE_MARGIN_X = 70
const HOUSE_MARGIN_Y = 40
const HOUSE_OFFSET_Y = 40
const HOUSE_POSITION = [
  // Square
  { x: -HOUSE_MARGIN_X, y: -HOUSE_MARGIN_Y },
  { x: +HOUSE_MARGIN_X, y: -HOUSE_MARGIN_Y },
  { x: -HOUSE_MARGIN_X, y: +HOUSE_MARGIN_Y },
  { x: +HOUSE_MARGIN_X, y: +HOUSE_MARGIN_Y },

  // Middle line
  { x: 0, y: -HOUSE_MARGIN_Y * 2 },
  { x: 0, y: 0 },
  { x: 0, y: +HOUSE_MARGIN_Y * 2 },
].map(({ x, y }) => ({ x, y: y + HOUSE_OFFSET_Y }))

interface Props {
  [key: string]: Prop<Primitive>
  houseCount: Prop<number>
}

class Village {
  readonly id: string
  readonly tile: Tile
  props: Props
  houses: Sprite[] = []
  housePositions = shuffle(HOUSE_POSITION)

  constructor(id: string, tile: Tile, houseCount: number) {
    this.id = id
    this.tile = tile
    this.props = {
      houseCount: createProp(houseCount),
    }

    this.addHouses(houseCount)
    tile.village = this
  }

  setProp(key: keyof Props, value: Primitive) {
    if (this.props[key].current === value) return

    this.props[key].previous = this.props[key].current
    this.props[key].current = value

    switch (key) {
      case 'houseCount':
        this.updateHouses()
        if (this.houseCount === 0) {
          this.destroy()
        }
        break
    }
  }
  addHouses(count: number, animate: boolean = false) {
    const pixel = getPixelPosition(this.tile.axial)

    for (let i = 0; i < count; i++) {
      const housePosition = this.housePositions[this.houses.length]
      const image = createImage('house')
      image.x = pixel.x + housePosition.x
      image.y = pixel.y + housePosition.y
      image.anchor.set(0.5, 1)

      const scale = 0.5 + Math.random() * 0.5
      if (animate) {
        image.scale.x = 0
        image.scale.y = 0
        new Animation(
          image,
          (image: Sprite, fraction: number) => {
            image.scale.y = scale * fraction
            image.scale.x = scale * fraction
          },
          {
            speed: 0.04,
          }
        )
      } else {
        image.scale.set(scale)
      }

      this.houses.push(image)
    }
  }
  updateHouses() {
    const previous = this.houses.length
    const toAdd = this.houseCount - previous

    if (toAdd <= 0) return

    this.addHouses(toAdd, true)
  }
  destroy() {
    if (!store.game) return

    store.game.villages.delete(this.id)
    this.tile.village = null
    for (let i = 0; i < this.houses.length; i++) {
      destroyImage('house', this.houses[i])
    }
  }

  // Prop getters
  get houseCount() {
    return this.props.houseCount.current
  }
}

export default Village
