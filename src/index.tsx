import ReactDOM from 'react-dom'
import React from 'react'
import Homepage from './pages/homepage'
import { Router } from '@reach/router'
import Game from './pages/game'
import GlobalStyle from './components/GlobalStyle'
import { AuthProvider } from './auth'

ReactDOM.render(
  <>
    <GlobalStyle />
    <AuthProvider>
      <Router>
        <Homepage path="/" />
        <Game path="game" />
      </Router>
    </AuthProvider>
  </>,
  document.getElementById('root')
)
