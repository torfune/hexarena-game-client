import Building from '../core/classes/Building'
import { Graphics } from 'pixi.js'

interface Road {
  buildings: Building[]
  line: Graphics
}

export default Road
