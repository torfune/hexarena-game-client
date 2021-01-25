import { Axial } from '../types/coordinates'

// TILE
export const TILE_RADIUS = 73.8
export const TILE_IMAGES = [
  'gold',
  'fog',
  'arrow',
  'action',
  'armyIcon',
  'castle',
  'tower',
  'capital',
  'hpBackground',
  'hpFill',
  'camp',
  'armyDragArrow',
  'mountain',
  'house',
  'tree',
  'army',
  'border',
  'patternPreview',
  'blackOverlay',
  'pattern',
  'background',
].reverse()

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
export const HP_FILL_OFFSET_Y = 10
export const HP_FILL_OFFSET_X = 26
export const ARMY_ICON_OFFSET_Y = {
  CAPITAL: 185,
  CAMP: 150,
  TOWER: 160,
  CASTLE: 160,
}
export const HP_BACKGROUND_OFFSET = {
  CAPITAL: 135,
  TOWER: 110,
  CASTLE: 110,
}
export const IMAGE_OFFSET_Y = {
  CAPITAL: -10,
  CAMP: 64,
  CASTLE: 60,
  TOWER: 60,
}

// ZOOM
export const ZOOM_SPEED = 0.2
export const MAX_SCALE = 0.5
export const MIN_SCALE = 0.1
export const DEFAULT_SCALE = 0.5

// ARMIES
export const UNIT_COUNT = 16
export const UNIT_POSITION_OFFSET = 70
export const UNIT_MOVEMENT_SPEED = 0.02
export const UNIT_RADIUS = 12
export const UNIT_IMAGE_SCALE = 0.6
export const UNIT_DOOR_OFFSET = 32
export const UNIT_MAX_DELAY = 0.4

// COLORS
export const BEDROCK_BACKGROUND = '#bbb'
export const BEDROCK_BORDER = '#555'

// DEBUG COMMANDS
export const DEBUG_COMMANDS = [
  ['1', 'capture'],
  ['2', 'add_army'],
  ['3', 'lose_tile'],
  ['4', 'add_forest'],
  ['5', 'building'],
  ['6', 'add_player'],
  ['7', 'send_army'],
  ['8', 'add_gold'],
  ['c', 'clear'],
  ['e', 'add_castle'],
  ['f', 'dummy_send_army'],
  ['g', 'defeat'],
  ['r', 'dummy_capture'],
  ['t', 'add_village'],
  ['v', 'add_camp'],
  ['n', 'hp_remove'],
  ['m', 'hp_add'],
]
