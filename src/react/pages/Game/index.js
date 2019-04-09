import { observer } from 'mobx-react-lite'
import Diplomacy from './hud/Diplomacy'
import game from '../../../game'
import GameTime from './hud/GameTime'
import HoverPreview from './hud/HoverPreview'
import Leaderboard from './hud/Leaderboard'
import React, { useEffect } from 'react'
import store from '../../../store'
import styled from 'styled-components'
import Wood from './hud/Wood'
import YourEmpire from './hud/YourEmpire'

// import DefeatScreen from './screens/DefeatScreen'
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

const HUD = styled.div``

const Game = observer(() => {
  useEffect(() => {
    const element = document.getElementById('game')
    const name = window.localStorage.getItem('name')

    game.start(element, name)

    window.addEventListener('resize', game.updateScreenSize.bind(game))

    return () => {
      game.stop()
      window.removeEventListener('resize', game.updateScreenSize)
    }
  }, [])

  return (
    <Container>
      <div id="game" />

      {store.status === 'running' && store.showHUD && (
        <HUD>
          <Diplomacy />
          <GameTime />
          <HoverPreview />
          <Leaderboard />
          <Wood />
          <YourEmpire />
        </HUD>
      )}
    </Container>
  )
})

export default Game
