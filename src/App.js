import React, { Fragment } from 'react'
import { Router } from '@reach/router'

import Game from './pages/Game'
import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'
import Blog from './pages/Blog'
import Marketplace from './pages/Marketplace'

import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  @import url('https://rsms.me/inter/inter.css');
  @import url('https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700');

  * {
    outline: none;
    margin: 0;
  }
  
  html {
    font-family: 'Montserrat', sans-serif;
    background: #555;
  }
  
  @supports (font-variation-settings: normal) {
    html {
      font-family: 'Montserrat', sans-serif;
    }
  }
`

const App = () => {
  return (
    <Fragment>
      <GlobalStyle />
      <Router>
        <HomePage path="/" />
        <Game path="game" />
        <ContactPage path="contact" />
        <Blog path="blog" />
        <Marketplace path="marketplace" />
      </Router>
    </Fragment>
  )
}

export default App
