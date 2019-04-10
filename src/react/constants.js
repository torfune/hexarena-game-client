// COLORS
export const PRIMARY = '#e84118'
export const SECONDARY = '#c23616'
export const BLUE = '#0984e3'

// SHADOWS
export const BOX_SHADOW = '0px 2px 16px 0px rgba(0, 0, 0, 0.2)'
export const TEXT_SHADOW = '0px 1px 4px rgba(0, 0, 0, 0.2)'
export const LOGO_SHADOW = '0px 2px 16px rgba(0, 0, 0, 0.3)'

// HUD SCALE
let HUD_SCALE = (window.innerHeight / 1180) * 1.1

if (HUD_SCALE > 1) {
  HUD_SCALE = 1
}

export { HUD_SCALE }
