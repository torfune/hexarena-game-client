// COLORS
export const PRIMARY = '#e84118'
export const SECONDARY = '#c23616'
export const BLUE = '#0984e3'
export const COLOR = {
  HUD_BORDER: '#000',
  HUD_BACKGROUND: '#222222ee',
  BLUE: '#0984e3',
  FACEBOOK: '#3C5A99',
}

// SHADOWS
export const BOX_SHADOW = '0px 2px 16px 0px rgba(0, 0, 0, 0.2)'
export const TEXT_SHADOW = '0px 1px 4px rgba(0, 0, 0, 0.2)'
export const LOGO_SHADOW = '0px 2px 16px rgba(0, 0, 0, 0.3)'
export const SHADOW = {
  BUTTON: '0px 2px 8px #00000044',
  BUTTON_HOVER: '0px 2px 12px #00000066',
}

// MISC
export const CHAT_WIDTH = '500px'

// Z INDEX
export const Z_INDEX = {
  HEADER: 100,
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

// WEBSERVER & AUTH
export const GOOGLE_CLIENT_ID =
  '110619057119-agls5l4ghp08pmdbfj7mspsf55stoddh.apps.googleusercontent.com'

// BREAKPOINTS
export const BREAKPOINT = {
  MAIN_1: '1840px',
  MAIN_2: '1560px',
  MAIN_3: '1460px',
  HIDE_CHAT: '1260px',
  MAIN_4: '1060px',
  MAIN_5: '960px',
  FINAL: '860px',
}

// IFRAME
export const IFRAME = (() => {
  try {
    return window.self !== window.top
  } catch {
    return true
  }
})()
