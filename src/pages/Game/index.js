import React from 'react'
import styled from 'styled-components'

import { startGame, cancelAlliance } from '../../game'
import Leaderboard from './components/Leaderboard'
import PlayerInfo from './components/PlayerInfo'

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`

class Game extends React.Component {
  state = {
    leaders: [],
  }
  componentDidMount = () => {
    const gameElement = document.getElementById('game')

    startGame(gameElement, {
      setLeaders: this.handleLeadersChange,
    })

    cancelAlliance(42)
  }
  handleLeadersChange = leaders => {
    this.setState({ leaders })
  }
  render() {
    return (
      <div>
        <GameContainer id="game" />
        <Leaderboard leaders={this.state.leaders} />
        <PlayerInfo />
      </div>
    )
  }
}

export default Game
