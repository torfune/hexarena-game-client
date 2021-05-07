import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import * as PIXI from 'pixi.js'

// Setup pixi-layers plugin
// ;(window as any).PIXI = PIXI
// require('pixi-layers')

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
