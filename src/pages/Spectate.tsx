import styled from 'styled-components'
import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import Header from '../components/Header'
import Chat from './homepage/Chat'
import store from '../store'
import Game from '../game/classes/Game'
import { CHAT_WIDTH } from '../constants/react'
import Leaderboard from './game/hud/Leaderboard'
import HoverPreview from './game/hud/HoverPreview'
import EndScreen from './game/screens/EndScreen'
import GameTime from './game/hud/GameTime'

const Container = styled.div`
  width: calc(100vw - ${CHAT_WIDTH});
  height: 100vh;
  overflow: hidden;
`

const Spectate: React.FC = () => {
  if (!store._game) {
    store.createGame()
  }

  useEffect(() => {
    const canvas = document.getElementById('game-canvas')
    if (!canvas) throw Error('Cannot find canvas.')

    store.spectating = true
    store.game.render(canvas)

    store.gameIndex = Number(window.location.href.split('?gameIndex=')[1])
    store.game.spectate()

    return () => {
      store.game.destroy()
      store.spectating = false

      // Store cleanup
      store.actions = []
      store.allianceRequests = []
      store.armies = []
      store.tiles = {}
      store.hoveredTile = null
      store.startCountdown = null
      store.showHud = true
      store.fps = 0
      store.ping = 0
      store.timeFromActivity = 0
      store.gameTime = undefined
      store.serverTime = undefined
      store.notification = undefined
      store.goldAnimation = undefined
      store.gameMode = undefined
      store.flash = 0
      store.spawnTile = undefined
      store.changeHandlers = {}
      store.gameIndex = null
      store.idMap = {
        actions: {},
        allianceRequests: {},
        armies: {},
        players: {},
        tiles: {},
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

        {store.status === 'finished' && <EndScreen />}
      </Container>

      <Chat />
    </>
  )
}

export default observer(Spectate)
