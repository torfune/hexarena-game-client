import { observer } from 'mobx-react-lite'
import DefeatModal from './screens/DefeatModal'
import Diplomacy from './hud/Diplomacy'
import HoverPreview from './hud/HoverPreview'
import EndScreen from './screens/EndScreen'
import ErrorModal from './screens/ErrorModal'
import GameTime from './hud/GameTime'
import Leaderboard from './hud/Leaderboard'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import Performance from './hud/Performance'
import store from '../../store'
import Flasher from './hud/Flasher'
import * as React from 'react'
import NotificationManager from './hud/NotificationManager'
import Ally from './hud/Ally'
import qs from 'query-string'
import Lobby from './screens/Lobby'
import Player from '../../core/classes/Player'
import Surrender from './hud/Surrender'
import Economy from './hud/Economy'
import Spectators from './hud/Spectators'
import Tutorial from './hud/Tutorial'
import HowToPlay from '../../components/HowToPlay'
import LocalStorageManager from '../../LocalStorageManager'
import Game from '../../core/classes/Game'
import Socket from '../../websockets/Socket'
import GameMode from '../../types/GameMode'
import Api, { gsHost } from '../../Api'
import { version } from '../../../package.json'
import loadImages from '../../core/functions/loadImages'
import SoundManager from '../../SoundManager'
import GameStatus from '../../types/GameStatus'

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

const GamePage = observer(() => {
  const [_, refresh] = useState(Date.now())

  const connect = async () => {
    const canvas = document.getElementById('game-canvas')
    if (!canvas) throw new Error('Cannot find canvas.')

    const { gameId, accessKey } = qs.parse(window.location.search)
    if (!gameId || typeof gameId !== 'string') {
      store.error = { message: 'Connection failed' }
      throw new Error('Missing Game ID in URL.')
    } else if (!accessKey || typeof accessKey !== 'string') {
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

    // Check Versions
    const serverVersion = statusResponse.data.version.slice(0, 4)
    const clientVersion = version.slice(0, 4)
    if (serverVersion !== clientVersion) {
      const lastVersionReloaded = LocalStorageManager.get('lastVersionReloaded')
      if (lastVersionReloaded !== clientVersion) {
        LocalStorageManager.set('lastVersionReloaded', clientVersion)
        window.location.reload()
      } else {
        store.error = {
          message: `Version mismatch. Client: ${version}. Server: ${statusResponse.data.version}`,
          goHome: true,
        }
      }
      return
    }

    // Setup Global Game Config
    store.gsConfig = configResponse.data

    // Load Images
    await loadImages()

    // Load sounds
    SoundManager.init()

    // Connect Socket
    store.socket = new Socket()
    let gameMode: GameMode
    let gameStatus: GameStatus
    try {
      const serverHost = await gsHost()
      const result = await store.socket.connect(serverHost, gameId, accessKey)
      gameMode = result.gameMode
      gameStatus = result.gameStatus
    } catch (error) {
      console.error(error)
      store.error = { message: 'Connection failed.' }
      return
    }

    // Create Game instance
    store.game = new Game(gameId, gameMode, gameStatus)
    store.game.render(canvas)

    // Load Settings from Local Storage
    store.settings.sound = LocalStorageManager.get('soundEnabled') === 'true'

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

  // useEffect(() => {
  // if (!store.game) return
  // const { mode, status } = store.game
  // if (mode === 'TUTORIAL' && status === 'finished') {
  //   LocalStorageManager.set('tutorialFinished', String('true'))
  // }
  // })

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

          {store.game.status === 'running' && store.game.player && (
            <HudContainer>
              <GameTime />

              {store.game.player.alive && (
                <>
                  {store.game.mode === '2v2' &&
                    renderDiplomacy(store.game.player)}

                  <HoverPreview />
                  <Leaderboard />
                  <Economy />
                  <Performance />
                </>
              )}

              <Surrender />
              <Spectators />

              {/*{store.game.mode === 'TUTORIAL' && <Tutorial />}*/}
              {!store.game.player.alive && <DefeatModal />}
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

      <HowToPlay
        show={store.showGuide}
        close={() => (store.showGuide = false)}
      />
    </Container>
  )
})

const renderDiplomacy = (player: Player) => {
  if (player.ally) {
    return <Ally ally={player.ally} playerGold={player.gold} />
  }

  return <Diplomacy />
}

export default GamePage
