import { observer } from 'mobx-react-lite'
import Diplomacy from './hud/Diplomacy'
import game from '../../../game'
import GameTime from './hud/GameTime'
import HoverPreview from './hud/HoverPreview'
import Leaderboard from './hud/Leaderboard'
import React, { useEffect } from 'react'
import store from '../../../store'
import { navigate } from '@reach/router'
import styled from 'styled-components'
import Wood from './hud/Wood'
import YourEmpire from './hud/YourEmpire'
import DefeatModal from './screens/DefeatModal'
import SpectateCloseButton from './screens/SpectateCloseButton'

// import ErrorScreen from './screens/ErrorScreen'
// import TimesUpScreen from './screens/TimesUpScreen'
// import WaitingScreen from './screens/WaitingScreen'
// import WinScreen from './screens/WinScreen'

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`

const Game = observer(() => {
  if (store.alreadyPlaying) {
    navigate('/nope')
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

  return (
    <Container>
      <div id="game" />

      {store.status === 'running' && (
        <>
          {store.showHud && store.player.alive && (
            <>
              <Diplomacy />
              <GameTime />
              <HoverPreview />
              <Leaderboard />
              <Wood />
              <YourEmpire />
            </>
          )}

          {!store.player.alive &&
            (store.spectating ? (
              <>
                <SpectateCloseButton />
                <Leaderboard />
              </>
            ) : (
              <DefeatModal />
            ))}
        </>
      )}
    </Container>
  )
})

export default Game
