import Ally from './hud/Ally'
import HoverPreview from './hud/HoverPreview'
import Api, { gsHost } from '../services/Api'
import SoundManager from '../services/SoundManager'
import GameStatus from '../types/GameStatus'
import { observer } from 'mobx-react-lite'
import Economy from './hud/Economy'
import Lobby from './screens/Lobby'
import loadImages from '../core/functions/loadImages'
import LocalStorageService from '../services/LocalStorageService'
import GameTime from './hud/GameTime'
import Spectators from './hud/SpectatorCount'
import HowToPlay from './_HowToPlay'
import Player from '../core/classes/Player'
import Leaderboard from './hud/Leaderboard'
import NotificationManager from './hud/NotificationManager'
import Diplomacy from './hud/Diplomacy'
import DefeatModal from './screens/DefeatModal'
import EndScreen from './screens/EndScreen'
import Surrender from './hud/Surrender'
import GameMode from '../types/GameMode'
import Flasher from './hud/Flasher'
import Game from '../core/classes/Game'
import React, { useEffect, useState } from 'react'
import Socket from '../core/websockets/Socket'
import styled from 'styled-components'
import qs from 'query-string'
import store from '../core/store'
import { version } from '../../package.json'
import ErrorModal from './screens/ErrorModal'
import GlobalStyle from './GlobalStyle'

interface Props {
  spectate: boolean
}
const GameComponent = observer(({ spectate }: Props) => {
  const [_, refresh] = useState(Date.now())

  const connect = async () => {
    console.log('connecting ...')

    const canvas = document.getElementById('game-canvas')
    if (!canvas) throw new Error('Cannot find canvas.')

    const { gameId, accessKey } = qs.parse(window.location.search)
    if (!gameId || typeof gameId !== 'string') {
      store.error = { message: 'Connection failed' }
      throw new Error('Missing Game ID in URL.')
    } else if (!spectate && (!accessKey || typeof accessKey !== 'string')) {
      store.error = { message: 'Connection failed' }
      throw new Error('Missing Access Key in URL.')
    }

    // Fetch Config & Check Server Status
    let responses
    try {
      responses = await Promise.all([
        Api.gs.get(`/config`),
        Api.gs.get('/status'),
        Api.ws.get('/status'),
      ])
    } catch (error) {
      console.error(error)
      store.loading = false
      store.error = { message: 'Connection failed.' }
      return
    }
    const [configResponse, statusResponse] = responses

    // Check client version
    const serverVersion = statusResponse.data.version.slice(0, 4)
    const clientVersion = version.slice(0, 4)
    if (serverVersion !== clientVersion) {
      const lastVersionReloaded = LocalStorageService.get('lastVersionReloaded')
      if (lastVersionReloaded !== clientVersion) {
        LocalStorageService.set('lastVersionReloaded', clientVersion)
        window.location.reload()
      } else {
        store.error = {
          message: `Version mismatch. Client: ${version}. Server: ${statusResponse.data.version}`,
          goHome: true,
        }
      }
      console.log('Version mismatch')
      return
    }

    // Set global game configuration
    store.gsConfig = configResponse.data

    // Load images
    await loadImages()

    // Load sounds
    SoundManager.init()

    // Connect Socket
    store.socket = new Socket()
    let gameMode: GameMode
    let gameStatus: GameStatus
    try {
      const serverHost = await gsHost()
      const result = await store.socket.connect(serverHost, gameId, {
        accessKey: accessKey as string | null,
        spectate,
      })
      gameMode = result.gameMode
      gameStatus = result.gameStatus
    } catch (error) {
      console.error(error)
      store.error = { message: 'Connection failed' }
      return
    }

    // Create Game instance
    store.game = new Game(gameId, gameMode, gameStatus)
    store.game.render(canvas)

    // Load Settings from Local Storage
    store.settings.sound = LocalStorageService.get('soundEnabled') === 'true'

    // Done
    store.loading = false
  }

  useEffect(() => {
    connect()
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleResize = () => {
    refresh(Date.now())
  }

  return (
    <Container>
      <GameCanvas
        id="game-canvas"
        visible={
          !!store.game &&
          (store.game.status === 'running' || store.game.status === 'finished')
        }
      />

      {store.game && (
        <>
          {store.game.status === 'starting' && <Lobby />}

          {store.game.status === 'running' && (
            <HudContainer>
              <GameTime />
              <HoverPreview />
              <Leaderboard />
              <Economy />
              <Spectators />

              {/*{store.game.mode === '2v2' &&*/}
              {/*  renderDiplomacy(store.game.player)}*/}

              {store.game.player && (
                <>{store.game.player.alive ? <Surrender /> : <DefeatModal />}</>
              )}
            </HudContainer>
          )}

          {store.game.status === 'running' && (
            <>
              <Flasher />
              <NotificationManager />
            </>
          )}

          {store.game.status === 'finished' && <EndScreen />}
        </>
      )}

      {store.error && (
        <ErrorModal
          message={store.error.message}
          goHome={store.error.goHome || true}
        />
      )}

      <HowToPlay
        show={store.showGuide}
        close={() => (store.showGuide = false)}
      />
    </Container>
  )
})

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`

const HudContainer = styled.div`
  z-index: 10;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

interface GameCanvasProps {
  visible: boolean
}
const GameCanvas = styled.div<GameCanvasProps>`
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
`

// const renderDiplomacy = (player: Player) => {
//   if (player.ally) {
//     return <Ally ally={player.ally} playerGold={player.gold} />
//   }
//
//   return <Diplomacy />
// }

export default GameComponent
