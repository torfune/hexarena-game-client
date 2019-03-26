import React, { Fragment } from 'react'
import styled from 'styled-components'
import { Router } from '@reach/router'
import Game from './pages/Game'
import Homepage from './pages/Homepage'
import GamesOverview from './pages/GamesOverview'
import GlobalStyle from './GlobalStyle'

const BlackOverlay = styled.div`
  background: #000;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: -1;
  opacity: 0.6;
`

const App = () => (
  <Fragment>
    <GlobalStyle />
    <BlackOverlay />
    <Router>
      <Homepage path="/" />
      <Game path="game" />
      <GamesOverview path="games" />
    </Router>
  </Fragment>
)

export default App
