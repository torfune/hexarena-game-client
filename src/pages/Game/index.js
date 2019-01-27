import React from 'react'
import styled from 'styled-components'

import { startGame, clearGame, cancelAlliance } from '../../game'
import Leaderboard from './components/Leaderboard'
import PlayerInfo from './components/PlayerInfo'
import ErrorMessage from './components/ErrorMessage'
import loadImages from '../../utils/loadImages'

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`

class Game extends React.Component {
  state = {
    leaders: [],
    connectionError: false,
  }
  componentDidMount = async () => {
    const gameElement = document.getElementById('game')

    await loadImages()

    startGame(gameElement, {
      setLeaders: this.handleLeadersChange,
      showConnectionError: this.handleConnectionError,
    })

    cancelAlliance(42)
  }
  componentWillUnmount = () => {
    clearGame()
  }
  handleLeadersChange = leaders => {
    this.setState({ leaders })
  }
  handleConnectionError = () => {
    this.setState({ connectionError: true })
  }
  render() {
    if (this.state.connectionError) {
      return <ErrorMessage>Can't connect to the GameServer</ErrorMessage>
    }

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
