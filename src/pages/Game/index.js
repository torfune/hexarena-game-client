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
import DebugInfo from './components/DebugInfo'
import Resources from './components/Resources'

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
    leaders: [],
    connectionError: false,
    actionPreview: null,
    namePreview: null,
    debugInfo: null,
    defeated: false,
    killerName: null,
    secondsSurvived: null,
    hoveredStructure: null,
  }
  componentDidMount = async () => {
    const gameElement = document.getElementById('game')
    const name = window.localStorage.getItem('name')

    await startGame(
      gameElement,
      {
        setLeaders: this.handleLeadersChange,
        setName: this.handleNameChange,
        setTilesCount: this.handleTilesCountChange,
        setActionPreview: this.handleActionPreviewChange,
        setNamePreview: this.handleNamePreviewChange,
        showConnectionError: this.handleConnectionError,
        setDebugInfo: this.handleDebugInfoChange,
        setWood: this.handleWoodChange,
        showDefeatScreen: this.showDefeatScreen,
        setHoveredStructure: this.handleHoveredStructureChange,
      },
      name
    )
  }
  componentWillUnmount = () => {
    stopGame()
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
  handleDebugInfoChange = debugInfo => {
    this.setState({ debugInfo })
  }
  handleTilesCountChange = tilesCount => {
    this.setState({ tilesCount })
  }
  handleActionPreviewChange = actionPreview => {
    this.setState({ actionPreview })
  }
  handleNamePreviewChange = namePreview => {
    this.setState({ namePreview })
  }
  handleWoodChange = wood => {
    this.setState({ wood })
  }
  showDefeatScreen = ({ killerName, secondsSurvived }) => {
    this.setState({ defeated: true, killerName, secondsSurvived })
  }
  handleHoveredStructureChange = hoveredStructure => {
    this.setState({ hoveredStructure })
  }
  render() {
    const {
      actionPreview,
      namePreview,
      connectionError,
      tilesCount,
      leaders,
      name,
      debugInfo,
      wood,
      defeated,
      secondsSurvived,
      killerName,
      hoveredStructure,
    } = this.state

    if (connectionError) {
      return <ErrorMessage />
    }

    return (
      <PageWrapper>
        <div id="game" />
        <DebugInfo info={debugInfo} />
        <Leaderboard leaders={leaders} />
        <PlayerInfo name={name} tilesCount={tilesCount} />
        <Resources wood={wood} />
        <ActionPreview actionPreview={actionPreview} />
        <NamePreview name={namePreview} />

        {hoveredStructure && (
          <StructureName
            name={hoveredStructure.name}
            x={hoveredStructure.x}
            y={hoveredStructure.y}
          />
        )}

        {defeated && (
          <DefeatScreen
            killerName={killerName}
            secondsSurvived={secondsSurvived}
          />
        )}
      </PageWrapper>
    )
  }
}

export default Game
