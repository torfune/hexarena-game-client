import { observer } from 'mobx-react-lite'
import DefeatModal from './screens/DefeatModal'
import Diplomacy from './hud/Diplomacy'
import HoverPreview from './hud/HoverPreview'
import EndScreen from './screens/EndScreen'
import ErrorModal from './screens/ErrorModal'
import GameTime from './hud/GameTime'
import Leaderboard from './hud/Leaderboard'
import { useEffect } from 'react'
import SpectateCloseButton from './screens/SpectateCloseButton'
import styled from 'styled-components'
import Gold from './hud/Gold'
import Performance from './hud/Performance'
import SurrenderButton from './hud/SurrenderButton'
import game from '../../game'
import store from '../../store'
import { useAuth } from '../../auth'
import Flasher from './hud/Flasher'
import * as React from 'react'
import NotificationManager from './hud/NotificationManager'
import { RouteComponentProps } from '@reach/router'
import Ally from './hud/Ally'
import Lobby from './screens/Lobby'
import showSurrenderButton from '../../game/functions/showSurrenderButton'
import playerId from '../../websockets/messages/playerId'
import Player from '../../game/classes/Player'

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

const Game: React.FC<RouteComponentProps> = observer(() => {
  const { loggedIn } = useAuth()

  if (!store.status || store.status === 'aborted') {
    window.location.href = '/'
    return null
  }

  useEffect(() => {
    return () => {
      game.stop()
      window.removeEventListener('resize', game.updateScreenSize)
    }
  }, [])

  useEffect(() => {
    if (loggedIn === null) return

    const canvas = document.getElementById('game-canvas')
    if (!canvas) throw Error('Cannot find canvas.')

    game.start(canvas)

    window.addEventListener('resize', game.updateScreenSize.bind(game))
  }, [loggedIn])

  const { status, showHud, gameMode, player, spectating, error } = store

  return (
    <Container>
      <GameCanvas
        id="game-canvas"
        visible={status === 'running' || status === 'finished'}
      />

      {status === 'starting' && <Lobby />}

      {status === 'running' && player && (
        <HudContainer>
          <GameTime />

          {showHud && player.alive && (
            <>
              {gameMode === 'diplomacy' && renderDiplomacy(player)}

              <HoverPreview />
              <Leaderboard />
              <Gold />
              <Performance />
            </>
          )}

          {showSurrenderButton(store.players, store.player) && (
            <SurrenderButton />
          )}

          {!player.alive &&
            (spectating ? (
              <>
                <SpectateCloseButton />
                <Leaderboard />
              </>
            ) : (
              <DefeatModal />
            ))}
        </HudContainer>
      )}

      {status === 'running' && (
        <>
          <Flasher />
          <NotificationManager />
        </>
      )}

      {status === 'finished' && <EndScreen />}

      {error && status !== 'finished' && (
        <ErrorModal message={error.message} goHome={error.goHome} />
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

export default Game
