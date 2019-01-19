import React from 'react'

import { startGame, cancelAlliance } from '../../game'
import Leaderboard from './components/Leaderboard'
import PlayerInfo from './components/PlayerInfo'

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
        <div id="game" />
        <Leaderboard leaders={this.state.leaders} />
        <PlayerInfo />
      </div>
    )
  }
}

export default Game
