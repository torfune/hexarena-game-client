import styled from 'styled-components'
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

const Container = styled.div`
  width: calc(100vw - ${CHAT_WIDTH});
  height: 100vh;
  overflow: hidden;
`

const Spectate: React.FC = () => {
  useEffect(() => {
    const canvas = document.getElementById('game-canvas')
    if (!canvas) throw Error('Cannot find canvas.')

    store.spectating = true
    store.reset()

    if (store._game) {
      store._game.destroy()
    }

    store.createGame()
    store.game.render(canvas)

    const gameIndex = Number(window.location.href.split('?gameIndex=')[1])
    store.game.spectate(gameIndex)

    return () => {
      if (store.spectating) {
        store.game.stopSpectate()
        store.game.destroy()
      }
    }
  }, [])

  return (
    <>
      <Header />

      <Container>
        <div id="game-canvas" />

        <GameTime />
        <HoverPreview />
        <Leaderboard />
        <Economy />

        {store.status === 'finished' && <EndScreen />}
      </Container>

      <Chat />
      <MatchFound />
    </>
  )
}

export default observer(Spectate)
