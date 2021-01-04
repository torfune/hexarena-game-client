import ReactDOM from 'react-dom'
import React, { useEffect, useState } from 'react'
import GamePage from './pages/game'
import Spectate from './pages/Spectate'
import GlobalStyle from './components/GlobalStyle'
import { AuthProvider } from './auth'
import store from './store'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loader from './components/Loader'
import { observer } from 'mobx-react-lite'
import Game from './core/classes/Game'
import Socket from './websockets/Socket'
import ErrorModal from './pages/game/screens/ErrorModal'
;(window as any).store = store

const App: React.FC = observer(() => {
  return (
    <>
      <GlobalStyle />
      <GamePage />

      {store.error && (
        <ErrorModal
          message={store.error.message}
          goHome={store.error.goHome || true}
        />
      )}

      {/*{game && socket && }*/}

      {/*<AuthProvider>*/}
      {/*<Router>*/}
      {/*  {store.loading || store.error ? (*/}
      {/*    <Loader />*/}
      {/*  ) : (*/}
      {/*    // <Switch>*/}
      {/*    //   <Route*/}
      {/*    //     exact*/}
      {/*    //     path="/"*/}
      {/*    //     render={({ history }) => <Homepage history={history} />}*/}
      {/*    //   />*/}
      {/*    //   <Route path="/game" component={Game} />*/}
      {/*    //   <Route*/}
      {/*    //     exact*/}
      {/*    //     path="/spectate"*/}
      {/*    //     render={({ history }) => <Spectate history={history} />}*/}
      {/*    //   />*/}
      {/*    //   <Route exact path="/privacy" component={Privacy} />*/}
      {/*    //   <Route component={PageNotFound} />*/}
      {/*    // </Switch>*/}
      {/*  )}*/}
      {/*</Router>*/}
      {/*</AuthProvider>*/}
    </>
  )
})

ReactDOM.render(<App />, document.getElementById('root'))
