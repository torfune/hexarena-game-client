import * as PIXI from 'pixi.js'

import hex from '../utils/hex'

class Rectangle {
  constructor(stage, options) {
    this.defaultOptions = options

    this.graphics = new PIXI.Graphics()
    stage.addChild(this.graphics)

    this.redraw(options)
  }
  redraw = ({
    color = this.defaultOptions.color,
    position = this.defaultOptions.position,
    width = this.defaultOptions.width,
    height = this.defaultOptions.height,
    scale = this.defaultOptions.scale,
    borderRadius = this.defaultOptions.borderRadius,
    alpha = this.defaultOptions.alpha,
  }) => {
    this.graphics.clear()
    this.graphics.beginFill(hex(color))
    this.graphics.drawRoundedRect(0, 0, width, height, borderRadius)
    this.graphics.endFill()
    this.graphics.x = position.x - (width * scale) / 2
    this.graphics.y = position.y - (height * scale) / 2
    this.graphics.alpha = alpha
    this.graphics.scale.x = scale
    this.graphics.scale.y = scale
  }
}

export default Rectangle
