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
import { RouteComponentProps } from '@reach/router'
import Ally from './hud/Ally'
import Lobby from './screens/Lobby'
import Player from '../../game/classes/Player'
import Surrender from './hud/Surrender'
import Economy from './hud/Economy'
import Spectators from './hud/Spectators'
import Tutorial from './hud/Tutorial'
import HowToPlay from '../../components/HowToPlay'
import LocalStorageManager from '../../LocalStorageManager'
import getBrowserId from '../../utils/getBrowserId'
import Socket from '../../websockets/Socket'

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
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
`

const GamePage: React.FC<RouteComponentProps> = observer(() => {
  const [_, refresh] = useState(Date.now())

  useEffect(() => {
    const { game, gsConfig } = store
    if (!game) {
      if (gsConfig && gsConfig.DEBUG_MODE) {
        const name = LocalStorageManager.get('guestName') || ''
        Socket.send('playAsGuest', `${getBrowserId()}|${name}`)
        return
      }

      window.location.href = '/'
      console.log('Game not found, redirect to homepage')
      return
    }

    const canvas = document.getElementById('game-canvas')
    if (!canvas) throw new Error('Cannot find game canvas.')

    game.render(canvas)

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    if (!store.game) return

    const { mode, status } = store.game

    if (mode === 'TUTORIAL' && status === 'finished') {
      LocalStorageManager.set('tutorialFinished', String('true'))
    }
  })

  const handleResize = () => {
    refresh(Date.now())
  }

  if (store.game && store.game.status === 'aborted') {
    console.warn(`Game aborted.`)
    window.location.href = '/'
    return null
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

              {store.game.mode === 'TUTORIAL' && <Tutorial />}
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

          {store.error && store.game.status !== 'finished' && (
            <ErrorModal
              message={store.error.message}
              goHome={store.error.goHome || true}
            />
          )}
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
