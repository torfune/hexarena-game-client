import ReactDOM from 'react-dom'
import React from 'react'
import Homepage from './pages/homepage'
import Game from './pages/game'
import GlobalStyle from './components/GlobalStyle'
import { AuthProvider } from './auth'
import store from './store'
import { BrowserRouter as Router, Route } from 'react-router-dom'
;(window as any).s = store

ReactDOM.render(
  <>
    <GlobalStyle />
    <AuthProvider>
      <Router>
        <Route
          path="/"
          exact
          render={({ history }) => <Homepage history={history} />}
        />
        <Route path="/game" component={Game} />
      </Router>
    </AuthProvider>
  </>,
  document.getElementById('root')
)
