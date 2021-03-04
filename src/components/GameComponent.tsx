import HoverPreview from './HUD/HoverPreview'
import Api, { getGameServerHost } from '../services/Api'
import SoundManager from '../services/SoundManager'
import GameStatus from '../types/GameStatus'
import { observer } from 'mobx-react-lite'
import Economy from './HUD/Economy'
import Lobby from './Lobby'
import loadImages from '../core/functions/loadImages'
import LocalStorageService from '../services/LocalStorageService'
import GameTime from './HUD/GameTime'
import Spectators from './HUD/SpectatorCount'
import Leaderboard from './HUD/Leaderboard'
import NotificationManager from './HUD/NotificationManager'
import EndModal from './EndModal'
import Surrender from './HUD/Surrender'
import GameMode from '../types/GameMode'
import Flasher from './HUD/Flasher'
import Game from '../core/classes/Game'
import React, { useEffect, useState } from 'react'
import Socket from '../core/websockets/Socket'
import styled from 'styled-components'
import qs from 'query-string'
import store from '../core/store'
import { version } from '../../package.json'
import ErrorModal from './ErrorModal'
import isSpectating from '../utils/isSpectating'
import { Z_INDEX } from '../constants/react'

const GameComponent = observer(() => {
  const [_, refresh] = useState(Date.now())

  const connect = async () => {
    console.log('connecting ...')

    const canvas = document.getElementById('game-canvas')
    if (!canvas) throw new Error('Cannot find canvas.')

    const { gameId, accessKey } = qs.parse(window.location.search)
    if (!gameId || typeof gameId !== 'string') {
      store.error = { message: 'Connection failed' }
      throw new Error('Missing Game ID in URL.')
    } else if (
      !isSpectating() &&
      (!accessKey || typeof accessKey !== 'string')
    ) {
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
    const serverVersion = statusResponse.data.version.split('.')[0]
    const clientVersion = version.split('.')[0]
    if (serverVersion !== clientVersion) {
      const lastVersionReloaded = LocalStorageService.get('lastVersionReloaded')
      if (lastVersionReloaded !== clientVersion) {
        LocalStorageService.set('lastVersionReloaded', clientVersion)
        window.location.reload()
      } else {
        store.error = {
          message: `Version mismatch. Client: ${version}. Server: ${statusResponse.data.version}`,
        }
      }
      console.error('Version mismatch')
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
      const hostname = await getGameServerHost()
      const result = await store.socket.connect(hostname, gameId, {
        accessKey: accessKey as string | null,
      })
      gameMode = result.gameMode
      gameStatus = result.gameStatus
    } catch (error) {
      console.error(error)
      store.error = { message: error.message }
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

  const renderModal = () => {
    const { game } = store

    if (game?.status === 'finished' || (game?.player && !game?.player.alive)) {
      return <EndModal />
    }

    if (store.error) {
      return <ErrorModal message={store.error.message} />
    }
  }

  const gameStatus = store.game ? store.game.status : null

  return (
    <Container>
      <GameCanvas
        id="game-canvas"
        visible={
          !!store.game &&
          (gameStatus === 'running' || gameStatus === 'finished')
        }
      />

      {store.game && (
        <>
          {gameStatus === 'starting' && <Lobby />}

          {(gameStatus === 'running' || gameStatus === 'finished') && (
            <HudContainer>
              <GameTime />
              <Leaderboard />
              <Economy />
              <Spectators />

              {store.game.player && store.game.player.alive && (
                <>
                  <Surrender />
                  <Flasher />
                  <NotificationManager />
                </>
              )}

              {(store.game?.player?.alive || isSpectating()) && (
                <HoverPreview />
              )}
            </HudContainer>
          )}
        </>
      )}

      {renderModal()}

      {/*<HowToPlay*/}
      {/*  show={store.showGuide}*/}
      {/*  close={() => (store.showGuide = false)}*/}
      {/*/>*/}
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
  z-index: ${Z_INDEX.HUD};
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

export default GameComponent
