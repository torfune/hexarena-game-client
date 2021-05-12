import { Axial } from '../types/coordinates'
import isSpectating from '../utils/isSpectating'

// TILE
export const TILE_RADIUS = 73.8
export const FOG_Z_INDEX = 10000
export const ATTENTION_NOTIFICATION_Z_INDEX = 4000
export const ATTENTION_NOTIFICATION_RADIUS = 180
export const ATTENTION_NOTIFICATION_ALPHA = 0.5
export const IMAGE_Z_INDEX = [
  'gold',
  'fog', // fogs
  'arrow', // dragArrows

  // objects ----
  'progress-bar', // objects
  'castle', // objects
  'tower', // objects
  'capital', // objects
  // ----

  'hp-background',
  'hp-fill',

  // objects ----
  'camp', // objects
  'house', // objects
  'army-drag-arrow-body',
  'army-drag-arrow-head',
  'mountain', // objects
  'army-icon', // objects
  'tree', // objects
  'army', // objects
  // ----

  // actions ----
  'action', // actions
  'action-building-preview', // actions
  // ----

  'village-bar', // objects
  'border', // borders
  'pattern-preview', // patterns
  'hover-hexagon', // overlay
  'overlay', // overlay
  'building-road', // roads
  'pattern', // patterns

  'background', // background
].reverse()

export const HOVER_HEXAGON_OPACITY = 0.1

export const NEIGHBOR_DIRECTIONS: Axial[] = [
  { x: 1, z: -1 },
  { x: 1, z: 0 },
  { x: 0, z: 1 },
  { x: -1, z: 1 },
  { x: -1, z: 0 },
  { x: 0, z: -1 },
]

// CAMERA
export const CAMERA_SPEED = 24

// IMAGE OFFSETS
export const FOREST_OFFSET_Y = 150
export const MOUNTAIN_OFFSET_Y = 70
export const VILLAGE_OFFSET_Y = 150
export const VILLAGE_BAR_OFFSET_Y = 170
export const VILLAGE_BAR_FILL_OFFSET_Y = 30
export const ROAD_OFFSET_Y = TILE_RADIUS * 2
export const GOLD_ANIMATION_OFFSET_Y = TILE_RADIUS * 2
export const ACTION_BAR_OFFSET_Y = 8
export const ACTION_BAR_FILL_OFFSET_Y = 22
export const ACTION_BAR_FILL_WIDTH = 140
export const VILLAGE_BAR_FILL_WIDTH = 140
export const BUILDING_REPAIR_BAR_FILL_OFFSET_Y = 18
export const BUILDING_REPAIR_BAR_FILL_WIDTH = 140
export const ACTION_FILL_OFFSET_Y = 22
export const BUILDING_OFFSET_Y = {
  CAMP: 90,
  TOWER: 80,
  CASTLE: 80,
  CAPITAL: 70,
}
export const ARMY_UNIT_OFFSET_Y = 140
export const ARMY_ICON_OFFSET_Y = {
  DEFAULT: 100,
  CAMP: 120,
  TOWER: 144,
  CASTLE: 144,
  CAPITAL: 180,
}
export const HP_BACKGROUND_OFFSET = {
  CAPITAL: 232,
  TOWER: 188,
  CASTLE: 188,
}
export const ACTION_OFFSET_Y = {
  CAPITAL: 162 + TILE_RADIUS,
  CAMP: 105 + TILE_RADIUS,
  TOWER: 203,
  CASTLE: 203,
  VILLAGE: 65 + TILE_RADIUS,
}

// ZOOM
export const ZOOM_SPEED = 0.2
export const MAX_SCALE = 0.5
export const MIN_SCALE = 0.1
const DEFAULT_SCALE_PLAY = 0.3
const DEFAULT_SCALE_SPECTATE = 0.15
export const DEFAULT_SCALE = isSpectating()
  ? DEFAULT_SCALE_SPECTATE
  : DEFAULT_SCALE_PLAY

// ARMIES
export const UNIT_COUNT = 16
export const UNIT_POSITION_OFFSET = 70
export const UNIT_MOVEMENT_SPEED = 0.022
export const UNIT_RADIUS = 12
export const UNIT_IMAGE_SCALE = 0.6
export const UNIT_DOOR_OFFSET = 32
export const UNIT_MAX_DELAY = 0.4

// COLORS
export const MOUNTAIN_BACKGROUND = '#eaeaea'
export const BEDROCK_BACKGROUND = '#5D6D7C'
export const BEDROCK_BORDER = '#fff'

// MISC
export const MAX_CLICK_DURATION = 500
export const HP_BAR_HIDE_DELAY = 200

// DEBUG COMMANDS
export const DEBUG_COMMANDS = [
  ['1', 'capture'],
  ['2', 'add_army'],
  ['3', 'lose_tile'],
  ['4', 'building'],
  ['5', 'add_bot'],
  ['o', 'remove_hp'],
  ['p', 'add_hp'],
  ['k', 'raid_village'],
  ['l', 'add_village_level'],
  ['6', 'add_10_gold'],
]
