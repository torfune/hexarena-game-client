import styled from 'styled-components'
import { History } from 'history'
import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import Header from '../components/Header'
import Chat from './homepage/Chat'
import store from '../store'
import { CHAT_WIDTH } from '../constants/react'
import Leaderboard from './game/hud/Leaderboard'
import HoverPreview from './game/hud/HoverPreview'
import EndScreen from './game/screens/EndScreen'
import GameTime from './game/hud/GameTime'
import MatchFound from '../components/MatchFound'
import Economy from './game/hud/Economy'
import Socket from '../websockets/Socket'

const Container = styled.div`
  width: calc(100vw - ${CHAT_WIDTH});
  height: 100vh;
  overflow: hidden;
`

interface Props {
  history: History
}
const Spectate: React.FC<Props> = ({ history }) => {
  store.routerHistory = history

  useEffect(() => {
    const gameId = window.location.href.split('?game=')[1]
    Socket.send('spectate', gameId)

    return () => {
      if (store.spectating) {
        Socket.send('stopSpectate')
        store.spectating = false
      }
      if (store.game) {
        store.game.destroy()
      }
    }
  }, [])

  useEffect(() => {
    if (store.game) {
      const canvas = document.getElementById('game-canvas')
      if (!canvas) throw Error('Cannot find canvas.')
      store.game.render(canvas)
    }
  }, [store.game])

  return (
    <>
      <Header />

      <Container>
        <div id="game-canvas" />

        {store.game && (
          <>
            <GameTime />
            <HoverPreview />
            <Leaderboard />
            <Economy />

            {store.game.status === 'finished' && <EndScreen />}
          </>
        )}
      </Container>

      <Chat />
      <MatchFound />
    </>
  )
}

export default observer(Spectate)
