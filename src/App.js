import React, { Fragment } from 'react'
import { Router } from '@reach/router'
import styled, { createGlobalStyle } from 'styled-components'

import Game from './pages/Game'
import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'
import Blog from './pages/Blog'
import Marketplace from './pages/Marketplace'
import GamesOverview from './pages/GamesOverview'
import screenshotSrc from './images/screenshot.png'

export const GlobalStyle = createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700');

  * {
    outline: none;
    margin: 0;
    box-sizing: border-box;
  }
  
  html {
    font-family: 'Montserrat', sans-serif;
    background: url(${screenshotSrc});
    background-size: cover;
    background-position: center;
    overflow-x: hidden;
    min-height: 100vh;
  }
  
  @supports (font-variation-settings: normal) {
    html {
      font-family: 'Montserrat', sans-serif;
    }
  }
`

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
  return (
    <Fragment>
      <GlobalStyle />
      <BlackOverlay />
      <Router>
        <HomePage path="/" />
        <Game path="game" />
        <ContactPage path="contact" />
        <Blog path="blog" />
        <Marketplace path="marketplace" />
        <GamesOverview path="games" />
      </Router>
    </Fragment>
  )
}

export default App
