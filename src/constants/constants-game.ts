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
  'fog',
  'arrow',
  'action',
  'castle',
  'tower',
  'capital',
  'hp-background',
  'hp-fill',
  'camp',
  'house',
  'army-drag-arrow-body',
  'army-drag-arrow-head',
  'mountain',
  'army-icon',
  'tree',
  'army',
  'village-bar',
  'border',
  'pattern-preview',
  'hover-hexagon',
  'overlay',
  'building-road',
  'pattern',
  'background',
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
export const ARMY_ICON_OFFSET_Y = {
  DEFAULT: 100,
  CAMP: 90,
  TOWER: 125,
  CASTLE: 125,
  CAPITAL: 150,
}
export const HP_BACKGROUND_OFFSET = {
  CAPITAL: 130,
  TOWER: 108,
  CASTLE: 108,
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
export const UNIT_MOVEMENT_SPEED = 0.02
export const UNIT_RADIUS = 12
export const UNIT_IMAGE_SCALE = 0.6
export const UNIT_DOOR_OFFSET = 32
export const UNIT_MAX_DELAY = 0.4

// COLORS
export const BORDER_COLOR = '#333'
export const MOUNTAIN_BACKGROUND = '#eaeaea'
export const BEDROCK_BACKGROUND = '#5D6D7C'
export const BEDROCK_BORDER = '#333'

// MISC
export const MAX_CLICK_DURATION = 500

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
]
