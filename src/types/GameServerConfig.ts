interface GameServerConfig {
  DEBUG_MODE: boolean
  ARMY_RANGE: number
  CAPTURE_COST: {
    DEFAULT: number
    FOREST: number
    MOUNTAIN: number
  }
  RECRUIT_COST: number
  CAMP_COST: number
  TOWER_COST: number
  CASTLE_COST: number
  VILLAGE_BASE_INCOME: number
  HOUSE_INCOME: number
  HP: {
    CAPITAL: 2
    TOWER: 2
    CASTLE: 3
  }
  PATTERNS: string[]
}

export default GameServerConfig
