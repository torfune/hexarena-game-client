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

  // ARMIES
  ARMY_RANGE: number

  // VISION
  DEFAULT_VISION: number
  MOUNTAIN_VISION: number
  BASE_VISION: number
  CASTLE_VISION: number

  // ACTIONS
  ATTACK_DURATION: number
  RECRUIT_DURATION: number
  CAMP_DURATION: number
  TOWER_DURATION: number
  CASTLE_DURATION: number

  // GOLD
  MAX_GOLD: number
  START_GOLD: number
  ATTACK_COST: number
  RECRUIT_COST: number
  CAMP_COST: number
  TOWER_COST: number
  CASTLE_COST: number

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

  // VILLAGES
  TILES_PER_VILLAGE: number
  VILLAGE_BONUS_INTERVAL: number
  VILLAGE_CAMPS: number
  VILLAGE_FORESTS: number

  // ALLIANCES
  REQUEST_TIMEOUT: number

  // MISC
  PATTERNS: string[]
}

export default GameServerConfig
