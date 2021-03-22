export const COLOR = {
  YELLOW: '#ffa801',
  YELLOW_HOVER: '#ffc048',
  GREEN: '#05c46b',
  GREEN_HOVER: '#0be881',
  BLUE: '#0fbcf9',
  BLUE_HOVER: '#4bcffa',
  RED: '#f53b57',
  RED_HOVER: '#ef5777',

  GREY_100: '#f1f3f5',
  GREY_200: '#485460',
  GREY_400: '#3E4852',
  GREY_600: '#2A3741',
  GREY_800: '#1e272e',
}

// SHADOWS
export const BOX_SHADOW = '0px 2px 16px 0px rgba(0, 0, 0, 0.2)'
export const SHADOW = {
  SMALL: 'rgba(0, 0, 0, 0.15) 0px 2px 6px',
  MEDIUM: 'rgba(0, 0, 0, 0.2) 0px 4px 16px',
}

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
  MODAL: 40,
  LOBBY: 30,
  LOADING_COVER: 20,
  HUD: 10,
}
