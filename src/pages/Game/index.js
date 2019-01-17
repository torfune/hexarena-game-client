import React from 'react'

import Two from '../../Two'

const tiles = [
  { x: 0, z: 0 },
  { x: 1, z: 0 },
  { x: 2, z: 0 },
  { x: 3, z: 0 },
  { x: 4, z: 0 },
  { x: 0, z: 1 },
  { x: 1, z: 1 },
  { x: 2, z: 1 },
  { x: 3, z: 1 },
  { x: 4, z: 1 },
]

class Game extends React.Component {
  componentDidMount = () => {
    const elem = document.getElementById('draw-shapes')

    const params = { width: 1000, height: 800, type: 'WebGLRenderer' }
    const two = new Two(params).appendTo(elem)

    const radius = 30
    const size = radius * 2

    const startX = 100
    const startY = 100

    for (let i = 0; i < tiles.length; i++) {
      const { x, z } = tiles[i]

      const pixel = {
        x: size * (Math.sqrt(3) * x + (Math.sqrt(3) / 2) * z) + startX,
        y: size * ((3 / 2) * z) + startY,
      }

      const hexagon = two.makePolygon(pixel.x, pixel.y, radius, 6)

      hexagon.fill = '#ccc'
      hexagon.stroke = '#222'
      hexagon.linewidth = 4
      hexagon.rotation = Math.PI / 2
    }

    two.update()
  }
  render() {
    return <div id="draw-shapes" />
  }
}

export default Game
