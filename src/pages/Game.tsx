import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import React from 'react'
import Ally from '../hud/Ally'
import DefeatModal from '../screens/DefeatModal'
import Diplomacy from '../hud/Diplomacy'
import Economy from '../hud/Economy'
import EndScreen from '../screens/EndScreen'
import Flasher from '../hud/Flasher'
import GameTime from '../hud/GameTime'
import HoverPreview from '../hud/HoverPreview'
import HowToPlay from '../components/HowToPlay'
import Leaderboard from '../hud/Leaderboard'
import Lobby from '../screens/Lobby'
import Storage from '../Storage'
import NotificationManager from '../hud/NotificationManager'
import Performance from '../hud/Performance'
import Player from '../game/classes/Player'
import Socket from '../websockets/Socket'
import Spectators from '../hud/Spectators'
import store from '../store'
import styled from 'styled-components'
import Surrender from '../hud/Surrender'
import Tutorial from '../hud/Tutorial'
import parseQuery from '../utils/parseQuery'

const Game = observer(() => {
  const [_, refresh] = useState(Date.now())

  useEffect(() => {
    const query = parseQuery()
    if (!query.gameId) throw new Error('Missing game id.')

    const accessToken = Storage.get('accessToken') || query.accessToken
    if (!accessToken) throw new Error('Missing access token.')

    Socket.send('play', `${query.gameId}|${accessToken}`)

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (!store.game) return

    const { mode, status } = store.game
    if (mode === 'TUTORIAL' && status === 'FINISHED') {
      Storage.set('tutorialFinished', String('true'))
    }
  })

  const handleResize = () => {
    refresh(Date.now())
  }

  if (store.game && store.game.status === 'ABORTED') {
    console.warn(`game aborted`)
    // window.location.href = '/'
    return null
  }

  return (
    <Container>
      <GameCanvas
        id="game-canvas"
        visible={
          !!store.game &&
          (store.game.status === 'RUNNING' || store.game.status === 'FINISHED')
        }
      />

      {store.game && (
        <>
          {store.game.status === 'STARTING' && <Lobby />}

          {store.game.status === 'RUNNING' && store.game.player && (
            <HudContainer>
              <GameTime />

              {store.game.player.alive && (
                <>
                  {store.game.mode === 'TEAMS_2v2' &&
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

          {store.game.status === 'RUNNING' && (
            <>
              <Flasher />
              <NotificationManager />
            </>
          )}

          {store.game.status === 'FINISHED' && <EndScreen />}
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
const GameCanvas = styled.div<{ visible: boolean }>`
  visibility: ${props => (props.visible ? 'visible' : 'hidden')};
`

export default Game
