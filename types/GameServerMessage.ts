import Action from '../game/classes/Action'
import Player from '../game/classes/Player'
import Tile from '../game/classes/Tile'
import Army from '../game/classes/Army'

interface GameServerMessage {
  isArray?: boolean
  instance?: boolean
  autoDestroy?: boolean
  type:
    | string
    | {
        [key: string]: string
      }
}

export default GameServerMessage
