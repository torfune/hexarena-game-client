import ReactDOM from 'react-dom'
import React from 'react'
import Homepage from './pages/homepage'
import Game from './pages/game'
import Spectate from './pages/Spectate'
import GlobalStyle from './components/GlobalStyle'
import { AuthProvider } from './auth'
import store from './store'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Loader from './components/Loader'
import { observer } from 'mobx-react-lite'
;(window as any).s = store

const App: React.FC = observer(() => (
  <>
    <GlobalStyle />
    <AuthProvider>
      <Router>
        {store.loading || store.error ? (
          <Loader />
        ) : (
          <>
            <Route
              path="/"
              exact
              render={({ history }) => <Homepage history={history} />}
            />
            <Route path="/game" component={Game} />
            <Route path="/spectate" component={Spectate} />
          </>
        )}
      </Router>
    </AuthProvider>
  </>
))

ReactDOM.render(<App />, document.getElementById('root'))
