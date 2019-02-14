import React from 'react'
import styled from 'styled-components'
import { navigate } from '@reach/router'

import { startGame, stopGame } from '../../game'

import Leaderboard from './components/Leaderboard'
import PlayerInfo from './components/PlayerInfo'
import ActionPreview from './components/ActionPreview'
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
    debugInfo: null,
  }
  componentDidMount = async () => {
    const gameElement = document.getElementById('game')

    await startGame(gameElement, {
      setLeaders: this.handleLeadersChange,
      setName: this.handleNameChange,
      setTilesCount: this.handleTilesCountChange,
      setActionPreview: this.handleActionPreviewChange,
      showConnectionError: this.handleConnectionError,
      setDebugInfo: this.handleDebugInfoChange,
      setWood: this.handleWoodChange,
    })

    document.addEventListener('keydown', this.handleKeyDown)
  }
  handleKeyDown = ({ key }) => {
    if (key === 'Escape') {
      navigate('/')
    }
  }
  componentWillUnmount = () => {
    stopGame()
    document.removeEventListener('keydown', this.handleKeyDown)
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
  handleWoodChange = wood => {
    this.setState({ wood })
  }
  render() {
    const {
      actionPreview,
      connectionError,
      tilesCount,
      leaders,
      name,
      debugInfo,
      wood,
    } = this.state

    if (connectionError) {
      return <ErrorMessage>Can't connect to the GameServer</ErrorMessage>
    }

    return (
      <PageWrapper>
        <div id="game" />
        <DebugInfo info={debugInfo} />
        <Leaderboard leaders={leaders} />
        <PlayerInfo name={name} tilesCount={tilesCount} />
        <Resources wood={wood} />
        <ActionPreview actionPreview={actionPreview} />
      </PageWrapper>
    )
  }
}

export default Game
