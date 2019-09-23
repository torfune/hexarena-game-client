import ReactDOM from 'react-dom'
import React from 'react'
import Homepage from './pages/homepage'
import Game from './pages/game'
import Privacy from './pages/Privacy'
import Spectate from './pages/Spectate'
import MatchHistory from './pages/MatchHistory'
import GlobalStyle from './components/GlobalStyle'
import { AuthProvider } from './auth'
import store from './store'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loader from './components/Loader'
import { observer } from 'mobx-react-lite'

// Global debug reference
import PageNotFound from './pages/PageNotFound'
;(window as any).store = store

const App: React.FC = observer(() => (
  <>
    <GlobalStyle />
    <AuthProvider>
      <Router>
        {store.loading || store.error ? (
          <Loader />
        ) : (
          <Switch>
            <Route
              exact
              path="/"
              render={({ history }) => <Homepage history={history} />}
            />
            <Route path="/game" component={Game} />
            <Route
              exact
              path="/spectate"
              render={({ history }) => <Spectate history={history} />}
            />
            <Route exact path="/privacy" component={Privacy} />
            <Route path="/match-history" component={MatchHistory} />
            <Route component={PageNotFound} />
          </Switch>
        )}
      </Router>
    </AuthProvider>
  </>
))

ReactDOM.render(<App />, document.getElementById('root'))
