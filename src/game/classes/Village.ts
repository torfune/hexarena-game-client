import Primitive from '../../types/Primitive'
import Prop from '../../types/Prop'
import createProp from '../../utils/createProp'
import Tile from './Tile'
import { Sprite } from 'pixi.js'
import createImage from '../functions/createImage'
import getPixelPosition from '../functions/pixelFromAxial'
import shuffle from '../../utils/shuffle'
import destroyImage from '../functions/destroyImage'
import store from '../../store'
import Animation from '../functions/animate'
import animate from '../functions/animate'

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

  updateProps(props: string[]) {
    for (let i = 0; i < props.length; i++) {
      switch (props[i]) {
        case 'houseCount':
          this.updateHouses()
          if (this.houseCount === 0) {
            this.destroy()
          }
          break
      }
    }
  }
  addHouses(count: number, preventAnimation: boolean = true) {
    const pixel = getPixelPosition(this.tile.axial)

    for (let i = 0; i < count; i++) {
      const housePosition = this.housePositions[this.houses.length]
      const image = createImage('house')
      image.x = pixel.x + housePosition.x
      image.y = pixel.y + housePosition.y
      image.anchor.set(0.5, 1)

      const scale = 0.9 + Math.random() * 0.2
      if (!preventAnimation) {
        image.scale.set(0)
        animate({
          image,
          duration: 200,
          onUpdate: (image, fraction) => {
            image.scale.set(scale * fraction)
          },
        })
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
