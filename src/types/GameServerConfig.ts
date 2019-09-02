interface GameServerConfig {
  // GENERAL
  DEBUG_MODE: boolean
  WORLD_SIZE: number
  BEDROCK_SIZE: number
  ARMY_SPEED: number
  TICK_RATE: number
  GAME_LENGTH: number
  TWO_PLAYERS_TIME_DROP: number
  CHAT_MESSAGE_MAX_LENGTH: number

  // MATCH MAKING
  COUNTDOWN_TIME: number

  // VISION
  DEFAULT_VISION: number
  MOUNTAIN_VISION: number
  BASE_VISION: number
  CASTLE_VISION: number

  // ACTION DURATIONS
  ATTACK_DURATION: number
  RECRUIT_DURATION: number
  CAMP_DURATION: number
  TOWER_DURATION: number
  CASTLE_DURATION: number
  HOUSE_DURATION: number

  // ACTION COSTS
  ATTACK_COST: number
  HOUSE_COST: number
  RECRUIT_COST: number
  CAMP_COST: number
  TOWER_COST: number
  CASTLE_COST: number

  // ECONOMY
  START_GOLD: number
  MAX_GOLD: number
  BASE_ECONOMY: number
  MIN_HOUSES: number
  MAX_HOUSES: number
  VILLAGE_BASE_INCOME: number
  HOUSE_INCOME: number
  HOUSE_LOOT: number
  VILLAGE_GROW_RATE: number

  // MANUAL ATTACKS
  DEFAULT_DEFEND_POWER: number
  DEFAULT_ATTACK_POWER: number
  POWER_PER_NEIGHBOR: number
  MS_PER_POWER: number

  // BUILDINGS
  HP: {
    BASE: 2
    TOWER: 2
    CASTLE: 3
  }

  // ALLIANCES
  REQUEST_TIMEOUT: number

  // MISC
  PATTERNS: string[]
}

export default GameServerConfig
