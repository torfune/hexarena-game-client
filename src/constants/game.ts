import { Axial } from '../types/coordinates'

// TILE
export const TILE_RADIUS = 73.8
export const TILE_IMAGES = [
  'gold',
  'fog',
  'action',
  'unitPreview',
  'castle',
  'tower',
  'capital',
  'armyIcon',
  'progressBar',
  'hpBackground',
  'hpFill',
  'camp',
  'armyDragArrow',
  'mountain',
  'house',
  'tree',
  'army',
  'buildPreview',
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
export const ARMY_ICON_OFFSET_Y = {
  TOWER: 170,
  CASTLE: 170,
  CAPITAL: 184,
}
export const HP_FILL_OFFSET_Y = 7
export const HP_FILL_OFFSET_X = 17
export const HP_HEIGHT = 40
export const HP_BACKGROUND_OFFSET = {
  TOWER: 110,
  CASTLE: 110,
  CAPITAL: 124,
}

// ZOOM
export const ZOOM_SPEED = 0.2
export const MAX_SCALE = 0.5
export const MIN_SCALE = 0.1
export const DEFAULT_SCALE = 0.5

// ARMIES
export const ARMY_ICON_UPDATE_RATE = 80
export const UNIT_SPEED = 0.015
export const UNIT_SIZE = 20
export const UNIT_DELAY = 0.09
export const UNIT_SCALE = {
  SMALL: 0.4,
  NORMAL: 1.2,
  LARGE: 2.4,
}
export const UNIT_OFFSET = {
  STRUCTURE: {
    Y_OFFSET: 24,
    RADIUS: 24,
  },
  FILL: 12,
  EDGE: {
    TOWER: 115,
    CASTLE: 115,
    CAPITAL: 115,
    MOUNTAIN: 110,
  },
}

// COLORS
export const BEDROCK_BACKGROUND = '#bbb'
export const BEDROCK_BORDER = '#555'
