import { observer } from 'mobx-react-lite'
import game from '../../../game'
import GameTime from './hud/GameTime'
import HoverPreview from './hud/HoverPreview'
import Leaderboard from './hud/Leaderboard'
import React, { useEffect } from 'react'
import store from '../../../store'
import styled from 'styled-components'
import Wood from './hud/Wood'
import YourEmpire from './hud/YourEmpire'
// import Diplomacy from './hud/Diplomacy'
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
          <YourEmpire />
          <Leaderboard />
          <Wood />
          <GameTime />
          <HoverPreview />
        </HUD>
      )}
    </Container>
  )
})

export default Game

// <Diplomacy
//   requests={this.state.requests}
//   players={this.state.players}
//   playerId={this.state.player ? this.state.player.id : null}
//   ally={this.state.ally}
//   allyDied={this.state.allyDied}
//   createRequest={createRequest}
//   acceptRequest={acceptRequest}
//   declineRequest={declineRequest}
// />
// <HoverPreview hoveredTileInfo={this.state.hoveredTileInfo} />
// <Actions actions={this.state.actionQueue} />
// {this.state.defeated && (
//   <DefeatScreen
//     killerName={this.state.killerName}
//     secondsSurvived={this.state.secondsSurvived}
//   />
// )}
// {this.state.timesUp && (
//   <TimesUpScreen
//     players={this.state.timesUpPlayers}
//     winnerId={this.state.timesUpWinnerId}
//     playerId={this.state.player.id}
//   />
// )}
// {this.state.waiting && this.state.players.length > 0 && (
//   <WaitingScreen
//     players={this.state.players}
//     player={this.state.player}
//     minPlayers={this.state.minPlayers}
//     countdownSeconds={this.state.countdownSeconds}
//     messages={this.state.messages}
//     sendMessage={sendMessage}
//     onPatternSelect={selectPattern}
//   />
// )}
// {this.state.isWinner && <WinScreen />
