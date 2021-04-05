interface GameServerConfig {
  DEBUG_MODE: boolean
  ARMY_HP: number
  CAPTURE_COST: {
    DEFAULT: number
    FOREST: number
    MOUNTAIN: number
  }
  RECRUIT_COST: number
  CAMP_COST: number
  TOWER_COST: number
  CASTLE_COST: number
  HP: {
    CAPITAL: number
    CAMP: number
    TOWER: number
    CASTLE: number
  }
  PATTERNS: string[]
}

export default GameServerConfig
