// COLORS
export const PRIMARY = '#e84118'
export const SECONDARY = '#c23616'
export const BLUE = '#0984e3'
export const COLOR = {
  HUD_BORDER: '#222',
  HUD_BACKGROUND: '#222222ee',
  BLUE: '#0984e3',
  FACEBOOK: '#3C5A99',
}

// SHADOWS
export const BOX_SHADOW = '0px 2px 16px 0px rgba(0, 0, 0, 0.2)'

// TRANSITIONS
export const TRANSITION = {
  SCALE: {
    config: { tension: 400 },
    from: { transform: 'scale(0)', opacity: 0 },
    enter: { transform: 'scale(1)', opacity: 1 },
    leave: { transform: 'scale(0)', opacity: 0 },
  },
}

export const Z_INDEX = {
  MODAL: 20,
  HUD: 10,
}
