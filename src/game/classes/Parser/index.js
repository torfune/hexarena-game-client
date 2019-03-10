import config from './config'
import parse from './parse'

class Parser {
  static parseAction = gsData => parse(gsData, config.action)
  static parseArmy = gsData => parse(gsData, config.army)
  static parsePlayer = gsData => parse(gsData, config.player)
  static parseTile = gsData => parse(gsData, config.tile)
}

export default Parser
