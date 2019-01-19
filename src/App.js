import React, { Fragment } from 'react'
import { Router } from '@reach/router'

import Game from './pages/Game'
import HomePage from './pages/HomePage'
import ContactPage from './pages/ContactPage'
import Blog from './pages/Blog'
import Marketplace from './pages/Marketplace'

import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Montserrat';
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
