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
  // Mount / Unmount
  useEffect(() => {
    if (!store.game) {
      console.warn(`Game instance not found`)
      return
    }

    const canvas = document.getElementById('game-canvas')
    if (!canvas) throw Error('Cannot find canvas.')

    store.game.render(canvas)

    window.addEventListener(
      'resize',
      store.game.updateScreenSize.bind(store.game)
    )

    return () => {
      if (!store.game) return

      window.removeEventListener('resize', store.game.updateScreenSize)

      // Force reload
      window.location.reload()
    }
  }, [])

  if (!store.game || store.game.status === 'aborted') {
    window.location.href = '/'
    console.warn(`Game instance not found.`)
    return null
  }

  const { status, player, mode } = store.game

  return (
    <Container>
      <GameCanvas
        id="game-canvas"
        visible={status === 'running' || status === 'finished'}
      />

      <>
        {status === 'starting' && <Lobby />}

        {status === 'running' && player && (
          <HudContainer>
            <GameTime />

            {player.alive && (
              <>
                {(mode === 'DIPLOMACY' ||
                  mode === 'TEAMS_4' ||
                  mode === 'TEAMS_6') &&
                  renderDiplomacy(player)}

                <HoverPreview />
                <Leaderboard />
                <Economy />
                <Performance />
              </>
            )}

            <Surrender />

            {!player.alive && <DefeatModal />}
          </HudContainer>
        )}

        {status === 'running' && (
          <>
            <Flasher />
            <NotificationManager />
          </>
        )}

        {status === 'finished' && <EndScreen />}

        {store.error && status !== 'finished' && (
          <ErrorModal
            message={store.error.message}
            goHome={store.error.goHome || true}
          />
        )}
      </>
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
