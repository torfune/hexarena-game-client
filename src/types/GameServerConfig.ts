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
  MIN_PLAYERS: number
  MAX_PLAYERS: number
  COUNTDOWN_TIME: number

  // VISION
  DEFAULT_VISION: number
  MOUNTAIN_VISION: number
  BASE_VISION: number
  CASTLE_VISION: number

  // ACTIONS
  MAX_ACTIONS: number
  BUILD_DURATION: number
  RECRUIT_DURATION: number
  CUT_DURATION: number
  HEAL_DURATION: number

  // GOLD
  MAX_GOLD: number
  START_GOLD: number
  BUILD_COST: number
  RECRUIT_COST: number
  GOLD_GAIN: number

  // MANUAL ATTACKS
  DEFAULT_DEFEND_POWER: number
  DEFAULT_ATTACK_POWER: number
  POWER_PER_NEIGHBOR: number
  MS_PER_POWER: number

  // BUILDINGS
  BASE_HP: number
  CASTLE_HP: number

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
