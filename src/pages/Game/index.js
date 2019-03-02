import React from 'react'
import styled from 'styled-components'

import { startGame, stopGame } from '../../game'

import Leaderboard from './components/Leaderboard'
import DefeatScreen from './components/DefeatScreen'
import PlayerInfo from './components/PlayerInfo'
import ActionPreview from './components/ActionPreview'
import NamePreview from './components/NamePreview'
import StructureName from './components/StructureName'
import ErrorMessage from './components/ErrorMessage'
import Resources from './components/Resources'
import WaitingScreen from './components/WaitingScreen'

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`

class Game extends React.Component {
  state = {
    wood: null,
    name: null,
    players: [],
    connectionError: false,
    actionPreview: null,
    namePreview: null,
    debugInfo: null,
    defeated: false,
    killerName: null,
    secondsSurvived: null,
    hoveredStructure: null,
    waiting: true,
    tilesCount: null,
    countdownSeconds: null,
  }
  componentDidMount = async () => {
    const gameElement = document.getElementById('game')
    const name = window.localStorage.getItem('name')

    await startGame(
      gameElement,
      {
        setPlayers: this.getChangeHandler('players'),
        setName: this.getChangeHandler('name'),
        setTilesCount: this.getChangeHandler('tilesCount'),
        setActionPreview: this.getChangeHandler('actionPreview'),
        setNamePreview: this.getChangeHandler('namePreview'),
        setDebugInfo: this.getChangeHandler('debugInfo'),
        setWood: this.getChangeHandler('wood'),
        setCountdownSeconds: this.getChangeHandler('countdownSeconds'),
        setHoveredStructure: this.getChangeHandler('hoveredStructure'),
        showDefeatScreen: this.showDefeatScreen,
        showConnectionError: () => {
          this.setState({ connectionError: true })
        },
        showGame: () => {
          this.setState({ waiting: false })
        },
      },
      name
    )
  }
  componentWillUnmount = () => {
    stopGame()
  }
  getChangeHandler = name => value => {
    this.setState({ [name]: value })
  }
  showDefeatScreen = ({ killerName, secondsSurvived }) => {
    this.setState({ defeated: true, killerName, secondsSurvived })
  }
  render() {
    if (this.state.connectionError) {
      return <ErrorMessage />
    }

    return (
      <PageWrapper>
        <div id="game" />
        <Leaderboard leaders={this.state.players} />
        <PlayerInfo name={this.state.name} tilesCount={this.state.tilesCount} />
        <Resources wood={this.state.wood} />
        <ActionPreview actionPreview={this.state.actionPreview} />
        <NamePreview name={this.state.namePreview} />

        {this.state.hoveredStructure && (
          <StructureName
            name={this.state.hoveredStructure.name}
            x={this.state.hoveredStructure.x}
            y={this.state.hoveredStructure.y}
          />
        )}

        {this.state.defeated && (
          <DefeatScreen
            killerName={this.state.killerName}
            secondsSurvived={this.state.secondsSurvived}
          />
        )}

        {this.state.waiting && (
          <WaitingScreen
            players={this.state.players}
            countdownSeconds={this.state.countdownSeconds}
          />
        )}
      </PageWrapper>
    )
  }
}

export default Game
