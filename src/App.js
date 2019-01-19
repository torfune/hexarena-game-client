import React, { Fragment } from 'react'

import Game from './pages/Game'
import HomePage from './pages/HomePage'
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
      <HomePage />
      <Game />
    </Fragment>
  )
}

export default App
