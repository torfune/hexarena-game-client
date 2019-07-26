import { observer } from 'mobx-react-lite'
import DefeatModal from './screens/DefeatModal'
import Diplomacy from './hud/Diplomacy'
import HoverPreview from './hud/HoverPreview'
import EndScreen from './screens/EndScreen'
import ErrorModal from './screens/ErrorModal'
import GameTime from './hud/GameTime'
import Leaderboard from './hud/Leaderboard'
import { useEffect } from 'react'
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
  useEffect(() => {
    if (!store.game) {
      window.location.href = '/'
      throw new Error('Game instance not found after 1 second.')
    }

    const canvas = document.getElementById('game-canvas')
    if (!canvas) throw new Error('Cannot find canvas.')

    store.game.render(canvas)
  }, [])

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
                  {(store.game.mode === 'DIPLOMACY' ||
                    store.game.mode === 'TEAMS_4' ||
                    store.game.mode === 'TEAMS_6') &&
                    renderDiplomacy(store.game.player)}

                  <HoverPreview />
                  <Leaderboard />
                  <Economy />
                  <Performance />
                </>
              )}

              <Surrender />

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
