// COLORS
export const PRIMARY = '#e84118'
export const SECONDARY = '#c23616'
export const BLUE = '#0984e3'

// SHADOWS
export const BOX_SHADOW = '0px 2px 16px 0px rgba(0, 0, 0, 0.2)'
export const TEXT_SHADOW = '0px 1px 4px rgba(0, 0, 0, 0.2)'
export const LOGO_SHADOW = '0px 2px 16px rgba(0, 0, 0, 0.3)'

// DIMENSIONS
export const MIN_SCREEN_WIDTH = 1366
export const MIN_SCREEN_HEIGHT = 768
export let HUD_SCALE = (window.innerHeight / 2000) * 2
if (HUD_SCALE > 1) {
  HUD_SCALE = 1
}

// WEBSERVER & AUTH
export const GOOGLE_CLIENT_ID =
  '110619057119-agls5l4ghp08pmdbfj7mspsf55stoddh.apps.googleusercontent.com'

// BREAKPOINTS
export const HOMEPAGE_BREAKPOINT = '1870px'

// IFRAME
export const IFRAME = (() => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
})()
console.log(`iframe: ${IFRAME}`)
