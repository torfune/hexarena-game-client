import { observer } from 'mobx-react-lite'
import DefeatModal from './screens/DefeatModal'
import Diplomacy from './hud/Diplomacy'
import EndScreen from './screens/EndScreen'
import ErrorModal from './screens/ErrorModal'
import game from 'game'
import GameTime from './hud/GameTime'
import HoverPreview from './hud/HoverPreview'
import Leaderboard from './hud/Leaderboard'
import React, { useEffect } from 'react'
import SpectateCloseButton from './screens/SpectateCloseButton'
import store from 'store'
import styled from 'styled-components'
import WaitingScreen from './screens/WaitingScreen'
import Wood from './hud/Wood'
import YourEmpire from './hud/YourEmpire'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`

const Game = observer(() => {
  if (store.alreadyPlaying) {
    // navigate('/nope')
  }

  useEffect(() => {
    const element = document.getElementById('game')
    const name = window.localStorage.getItem('name')
    const browserId = localStorage.getItem('browserId')

    game.start(element, name, browserId)

    window.addEventListener('resize', game.updateScreenSize.bind(game))

    return () => {
      game.stop()
      window.removeEventListener('resize', game.updateScreenSize)
    }
  }, [])

  const { status, showHud, player, spectating, error } = store

  return (
    <Container>
      <div id="game" />

      {(status === 'pending' || status === 'starting') && <WaitingScreen />}

      {status === 'running' && (
        <>
          <GameTime />

          {showHud && player.alive && (
            <>
              <Diplomacy />
              <HoverPreview />
              <Leaderboard />
              <Wood />
              <YourEmpire />
            </>
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
        </>
      )}

      {status === 'finished' && <EndScreen />}

      {error && <ErrorModal message={error} />}
    </Container>
  )
})

export default Game
