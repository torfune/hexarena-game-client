import { Axial } from '../types/coordinates'

// TILE
export const TILE_RADIUS = 73.8
export const TILE_IMAGES = [
  'gold',
  'contested',
  'fog',
  'actionIcon',
  'actionFill',
  'actionBg',
  'castle',
  'base',
  'camp',
  'hitpointsFill',
  'hitpointsBg',
  'armyIcon',
  'village',
  'mountain',
  'forest',
  'army',
  'arrow',
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
export const CAMERA_SPEED = 20

// IMAGE OFFSETS
export const ARMY_ICON_OFFSET_Y = 180
export const HEART_OFFSET_X = 57
export const HITPOINTS_OFFSET_Y = 176

// ZOOM
export const ZOOM_SPEED = 0.1
export const MAX_SCALE = 1
export const MIN_SCALE = 0.2
export const DEFAULT_SCALE = 0.5

// ARMIES
export const UNIT_COUNT = 8
export const UNIT_POSITION_OFFSET = 60
export const UNIT_MOVEMENT_SPEED = 0.02
export const UNIT_RADIUS = 16
export const UNIT_IMAGE_SCALE = 0.8
export const UNIT_DOOR_OFFSET = 48
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
  ['5', 'add_camp'],
  ['6', 'add_player'],
  ['7', 'send_army'],
  ['8', 'add_gold'],
  ['c', 'clear'],
  ['e', 'add_castle'],
  ['f', 'dummy_send_army'],
  ['g', 'defeat'],
  ['q', 'remove_hitpoint'],
  ['r', 'dummy_capture'],
  ['t', 'add_village'],
  ['w', 'add_hitpoint'],
]
