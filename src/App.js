import React from 'react'
import Two from './Two'

class App extends React.Component {
  componentDidMount = () => {
    const elem = document.getElementById('draw-shapes')

    const params = { width: 285, height: 200, type: 'WebGLRenderer' } 
    const two = new Two(params).appendTo(elem)

    const circle = two.makeCircle(72, 100, 50)
    const rect = two.makeRectangle(213, 100, 100, 100)

    circle.fill = '#FF8000'
    circle.stroke = 'orangered'
    circle.linewidth = 5

    rect.fill = 'rgb(0, 200, 255)'
    rect.opacity = 0.75
    rect.noStroke()

    two.update()
  }

  render() {
    return <div id='draw-shapes'></div>
  }
}

export default App
