import React from 'react'
import styled from 'styled-components'

import { startGame, clearGame, cancelAlliance, loadImages } from '../../game'

import Leaderboard from './components/Leaderboard'
import PlayerInfo from './components/PlayerInfo'
import ErrorMessage from './components/ErrorMessage'

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`

class Game extends React.Component {
  state = {
    name: null,
    leaders: [],
    connectionError: false,
  }
  componentDidMount = async () => {
    const gameElement = document.getElementById('game')

    await loadImages()

    startGame(gameElement, {
      setLeaders: this.handleLeadersChange,
      setName: this.handleNameChange,
      setTilesCount: this.handleTilesCountChange,
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
  handleNameChange = name => {
    this.setState({ name })
  }
  handleTilesCountChange = tilesCount => {
    this.setState({ tilesCount })
  }
  render() {
    if (this.state.connectionError) {
      return <ErrorMessage>Can't connect to the GameServer</ErrorMessage>
    }

    return (
      <div>
        <GameContainer id="game" />
        <Leaderboard leaders={this.state.leaders} />
        <PlayerInfo name={this.state.name} tilesCount={this.state.tilesCount} />
      </div>
    )
  }
}

export default Game
