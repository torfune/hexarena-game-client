import { observer } from 'mobx-react-lite'
import DefeatModal from './screens/DefeatModal'
import Diplomacy from './hud/Diplomacy'
import HoverPreview from './hud/HoverPreview'
import EndScreen from './screens/EndScreen'
import ErrorModal from './screens/ErrorModal'
import GameTime from './hud/GameTime'
import Leaderboard from './hud/Leaderboard'
import { useEffect, useState } from 'react'
import SpectateCloseButton from './screens/SpectateCloseButton'
import styled from 'styled-components'
import Lobby from './screens/Lobby'
import Gold from './hud/Gold'
import YourEmpire from './hud/YourEmpire'
import Performance from './hud/Performance'
import { animated, useTransition } from 'react-spring'
import SurrenderButton from './hud/SurrenderButton'
import game from '../../game'
import store from '../../store'
import { useAuth } from '../../auth'
import getBrowserId from '../../utils/getBrowserId'
import Spinner from '../../components/Spinner'
import Flasher from './hud/Flasher'
import * as React from 'react'
import NotificationManager from './hud/NotificationManager'
import { RouteComponentProps } from '@reach/router'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`

const SpinnerContainer = styled.div`
  color: #fff;
  position: absolute;
  top: 256px;
  width: 128px;
  transform: translateX(calc(50vw - 64px));

  p {
    text-align: center;
    margin-top: 32px;
    font-size: 20px;
    font-weight: 500;
  }
`

interface GameCanvasProps {
  visible: boolean
}
const GameCanvas = styled.div<GameCanvasProps>`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
`

let timeout: NodeJS.Timeout

const Game: React.FC<RouteComponentProps> = observer(() => {
  const [showLobby, setShowLobby] = useState(false)
  const { loggedIn, userId, accessToken } = useAuth()
  const transitions = useTransition(showLobby, null, {
    from: { opacity: 1 },
    leave: { opacity: 0 },
  })

  useEffect(
    () => () => {
      game.stop()
      window.removeEventListener('resize', game.updateScreenSize)
    },
    []
  )

  useEffect(() => {
    if (loggedIn === null) return

    const canvas = document.getElementById('game-canvas')
    if (!canvas) throw Error('Cannot find canvas.')

    game.start(
      canvas,
      getBrowserId(),
      loggedIn
        ? { userId, accessToken, guestName: null }
        : {
            userId: null,
            accessToken: null,
            guestName: window.localStorage.getItem('guestName'),
          }
    )

    window.addEventListener('resize', game.updateScreenSize.bind(game))
  }, [loggedIn])

  useEffect(() => {
    const show = store.status === 'pending' || store.status === 'starting'

    if (timeout) {
      clearTimeout(timeout)
    }

    if (show) {
      setShowLobby(true)
    } else {
      timeout = setTimeout(() => {
        setShowLobby(false)
      }, 500)
    }
  }, [store.status])

  const { status, showHud, players, player, spectating, error } = store

  let showSurrender = false
  let alivePlayers = 0

  for (let i = 0; i < players.length; i++) {
    if (players[i].alive) {
      alivePlayers++
    }
  }

  if (player && alivePlayers === 3 && (!player.ally || !player.ally.alive)) {
    for (let i = 0; i < players.length; i++) {
      const p = players[i]
      if (p.id !== player.id && p.ally && p.ally.alive) {
        showSurrender = true
        break
      }
    }
  }

  return (
    <Container>
      <GameCanvas
        id="game-canvas"
        visible={status === 'running' || status === 'finished'}
      />

      {status === 'running' && (
        <>
          <Flasher />
          <NotificationManager />
        </>
      )}

      {status !== 'running' && status !== 'finished' && (
        <SpinnerContainer>
          <Spinner size="128px" thickness="12px" />
          <p>Connecting</p>
        </SpinnerContainer>
      )}

      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div key={key} style={props}>
              <Lobby />
            </animated.div>
          )
      )}

      {status === 'running' && player && (
        <>
          <GameTime />

          {showHud && player.alive && (
            <>
              <Diplomacy />
              <HoverPreview />
              <Leaderboard />
              <Gold />
              <YourEmpire />
              <Performance />
            </>
          )}

          {showSurrender && <SurrenderButton />}

          {!player.alive &&
            (spectating ? (
              <>
                <SpectateCloseButton />
                <Leaderboard />
              </>
            ) : (
              <DefeatModal />
            ))}
        </>
      )}

      {status === 'finished' && <EndScreen />}

      {error && status !== 'finished' && (
        <ErrorModal message={error.message} goHome={error.goHome} />
      )}
    </Container>
  )
})

export default Game
