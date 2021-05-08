import * as PIXI from 'pixi.js'

// Setup pixi-layers plugin
;(window as any).PIXI = PIXI
require('pixi-layers')

export const Group = (window as any).PIXI.display.Group
export const Layer = (window as any).PIXI.display.Layer
export const Stage = (window as any).PIXI.display.Stage
