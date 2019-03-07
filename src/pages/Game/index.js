import React from 'react'
import styled from 'styled-components'

import { startGame, stopGame, sendMessage, updateScreenSize } from '../../game'

import Leaderboard from './components/Leaderboard'
import FinishCountdown from './components/FinishCountdown'
import DefeatScreen from './components/DefeatScreen'
import PlayerInfo from './components/PlayerInfo'
import ActionPreview from './components/ActionPreview'
import NamePreview from './components/NamePreview'
import StructureName from './components/StructureName'
import ErrorMessage from './components/ErrorMessage'
import Resources from './components/Resources'
import Actions from './components/Actions'
import WaitingScreen from './components/WaitingScreen'
import WinScreen from './components/WinScreen'

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
    messages: [],
    connectionError: false,
    actionPreview: null,
    namePreview: null,
    defeated: false,
    killerName: null,
    secondsSurvived: null,
    hoveredStructure: null,
    waiting: true,
    tilesCount: null,
    countdownSeconds: null,
    finishSeconds: null,
    isWinner: false,
    actionQueue: [],
  }
  componentDidMount = async () => {
    const gameElement = document.getElementById('game')
    const name = window.localStorage.getItem('name')
    const pattern = window.localStorage.getItem('pattern')

    await startGame(
      gameElement,
      {
        setPlayers: this.getChangeHandler('players'),
        setMessages: this.getChangeHandler('messages'),
        setName: this.getChangeHandler('name'),
        setTilesCount: this.getChangeHandler('tilesCount'),
        setActionPreview: this.getChangeHandler('actionPreview'),
        setNamePreview: this.getChangeHandler('namePreview'),
        setWood: this.getChangeHandler('wood'),
        setFinishSeconds: this.getChangeHandler('finishSeconds'),
        setActionQueue: this.getChangeHandler('actionQueue'),
        setCountdownSeconds: this.getChangeHandler('countdownSeconds'),
        setHoveredStructure: this.getChangeHandler('hoveredStructure'),
        showDefeatScreen: this.showDefeatScreen,
        winGame: () => {
          this.setState({ isWinner: true })
        },
        showConnectionError: () => {
          this.setState({ connectionError: true })
        },
        showGame: () => {
          this.setState({ waiting: false })
        },
      },
      name,
      pattern
    )

    window.addEventListener('resize', updateScreenSize)
  }
  componentWillUnmount = () => {
    stopGame()
    window.removeEventListener('resize', updateScreenSize)
  }
  getChangeHandler = name => value => {
    this.setState({ [name]: value })
  }
  showDefeatScreen = ({ killerName, secondsSurvived }) => {
    this.setState({ defeated: true, killerName, secondsSurvived })
  }
  render() {
    if (this.state.connectionError && !this.state.isWinner) {
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
        <Actions actions={this.state.actionQueue} />
        <FinishCountdown finishSeconds={this.state.finishSeconds} />

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

        {this.state.waiting && this.state.players.length > 0 && (
          <WaitingScreen
            players={this.state.players}
            countdownSeconds={this.state.countdownSeconds}
            messages={this.state.messages}
            sendMessage={sendMessage}
          />
        )}

        {this.state.isWinner && <WinScreen />}
      </PageWrapper>
    )
  }
}

export default Game
