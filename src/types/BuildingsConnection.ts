import Building from '../core/classes/Building'
import { Graphics } from 'pixi.js'

interface BuildingsConnection {
  buildings: Building[]
  line: Graphics
}

export default BuildingsConnection
