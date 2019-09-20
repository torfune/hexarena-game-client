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
import chance from '../functions/chance'
import animate from '../functions/animate'

const TREE_MARGIN_X = 70
const TREE_MARGIN_Y = 60
const TREE_OFFSET_Y = 52
const TREE_POSITION = [
  { x: 0, y: +TREE_MARGIN_Y + TREE_OFFSET_Y },
  { x: 0, y: -TREE_MARGIN_Y + TREE_OFFSET_Y },
  { x: +TREE_MARGIN_X, y: 0 + TREE_OFFSET_Y },
  { x: -TREE_MARGIN_X, y: 0 + TREE_OFFSET_Y },
]

interface Props {
  [key: string]: Prop<Primitive>
  treeCount: Prop<number>
}

class Forest {
  readonly id: string
  readonly tile: Tile
  props: Props
  trees: Sprite[] = []

  constructor(id: string, tile: Tile, treeCount: number) {
    this.id = id
    this.tile = tile
    this.props = {
      treeCount: createProp(treeCount),
      nextCutAt: createProp(null),
    }

    const pixel = getPixelPosition(tile.axial)
    const treePosition = shuffle(TREE_POSITION)
    const now = Date.now()
    for (let i = 0; i < treeCount; i++) {
      const image = createImage('tree')
      image.x = pixel.x + treePosition[i].x
      image.y = pixel.y + treePosition[i].y
      image.anchor.set(0.5, 1)

      if (now - this.tile.createdAt > 200) {
        image.scale.set(0)
        animate({
          image,
          duration: 200,
          delay: Math.round(Math.random() * 800),
          onUpdate: (image, fraction) => {
            image.scale.set(fraction)
          },
        })
      }

      this.trees.push(image)
    }

    tile.forest = this
  }

  updateProps(props: string[]) {
    for (let i = 0; i < props.length; i++) {
      switch (props[i]) {
        case 'treeCount':
          this.updateTrees()
          if (this.treeCount === 0) {
            this.destroy()
          }
          break
      }
    }
  }
  updateTrees() {
    const previous = this.trees.length
    const toRemove = previous - this.treeCount
    if (toRemove <= 0) return

    for (let i = 0; i < toRemove; i++) {
      const image = this.trees.pop()
      if (image) {
        this.treeFallAnimation(image)
      }
    }
  }
  treeFallAnimation(image: Sprite) {
    animate({
      image,
      duration: 800,
      context: chance(50) ? -1 : 1,
      ease: 'IN',
      onUpdate: (image, fraction, direction) => {
        image.rotation = (Math.PI / 2) * fraction * direction
        image.alpha = 1 - fraction
      },
      onFinish: image => {
        destroyImage('tree', image)
      },
    })
  }
  destroy() {
    if (!store.game) return

    store.game.forests.delete(this.id)
    this.tile.forest = null
  }

  // Prop getters
  get treeCount() {
    return this.props.treeCount.current
  }
}

export default Forest
