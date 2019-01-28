import * as PIXI from 'pixi.js'

import hex from '../functions/hex'

class Rectangle {
  constructor(options) {
    this.defaultOptions = options

    this.alpha = 0
    this.targetAlpha = options.alpha || 1
    this.animationStep = options.animationStep || 1

    this.graphics = new PIXI.Graphics()
    options.stage.addChild(this.graphics)

    this.redraw(options)
  }
  redraw = ({
    color = this.defaultOptions.color,
    position = this.defaultOptions.position,
    width = this.defaultOptions.width,
    height = this.defaultOptions.height,
    scale = this.defaultOptions.scale,
    borderRadius = this.defaultOptions.borderRadius,
  }) => {
    this.alpha += this.animationStep

    if (this.animationStep > 0 && this.alpha > this.targetAlpha) {
      this.alpha = this.targetAlpha
    }

    if (this.animationStep < 0 && this.alpha < this.targetAlpha) {
      this.alpha = this.targetAlpha
    }

    this.graphics.clear()
    this.graphics.beginFill(hex(color))
    this.graphics.drawRoundedRect(0, 0, width, height, borderRadius)
    this.graphics.endFill()
    this.graphics.x = position.x - (width * scale) / 2
    this.graphics.y = position.y - (height * scale) / 2
    this.graphics.alpha = this.alpha

    this.graphics.scale.x = scale
    this.graphics.scale.y = scale
  }
}

export default Rectangle
