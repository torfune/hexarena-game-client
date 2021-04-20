interface GameServerConfig {
  DEBUG_MODE: boolean
  ARMY_HP: number
  RECRUIT_ARMY_COST: number
  BUILD_CAMP_COST: number
  BUILD_TOWER_COST: number
  BUILD_CASTLE_COST: number
  HP: {
    CAPITAL: number
    CAMP: number
    TOWER: number
    CASTLE: number
  }
  PATTERNS: string[]
  VILLAGE_HOUSE_VALUE: number
}

export default GameServerConfig
