import React from 'react'
import styled from 'styled-components'

import { startGame, clearGame, cancelAlliance, loadImages } from '../../game'

import Leaderboard from './components/Leaderboard'
import PlayerInfo from './components/PlayerInfo'
import ActionPreview from './components/ActionPreview'
import ErrorMessage from './components/ErrorMessage'

const PageWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
`

class Game extends React.Component {
  state = {
    name: null,
    leaders: [],
    connectionError: false,
    actionPreview: null,
  }
  componentDidMount = async () => {
    const gameElement = document.getElementById('game')

    await loadImages()

    startGame(gameElement, {
      setLeaders: this.handleLeadersChange,
      setName: this.handleNameChange,
      setTilesCount: this.handleTilesCountChange,
      setActionPreview: this.handleActionPreviewChange,
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
  handleActionPreviewChange = actionPreview => {
    this.setState({ actionPreview })
  }
  render() {
    const {
      actionPreview,
      connectionError,
      tilesCount,
      leaders,
      name,
    } = this.state

    if (connectionError) {
      return <ErrorMessage>Can't connect to the GameServer</ErrorMessage>
    }

    return (
      <PageWrapper>
        <div id="game" />
        <Leaderboard leaders={leaders} />
        <PlayerInfo name={name} tilesCount={tilesCount} />
        <ActionPreview actionPreview={actionPreview} />
      </PageWrapper>
    )
  }
}

export default Game
