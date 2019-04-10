import React, { Fragment, useEffect } from 'react'
import styled from 'styled-components'
import { Router } from '@reach/router'
import Game from './pages/Game'
import GamesOverview from './pages/GamesOverview'
import NopePage from './pages/NopePage'
import GlobalStyle from './GlobalStyle'
import Homepage from './pages/Homepage'
import uuid from 'uuid/v4'

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

const App = () => {
  useEffect(() => {
    if (!localStorage.getItem('browserId')) {
      localStorage.setItem('browserId', uuid())
    }
  }, [])

  return (
    <Fragment>
      <GlobalStyle />
      <BlackOverlay />
      <Router>
        <NopePage path="nope" />
        <Homepage path="/" />
        <Game path="game" />
        <GamesOverview path="games" />
      </Router>
    </Fragment>
  )
}

export default App
