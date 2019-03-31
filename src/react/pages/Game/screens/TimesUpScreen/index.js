import React from 'react'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import PlayersTable from './PlayersTable'

const Container = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #444;
  color: #fff;
  padding-top: 128px;
  text-align: center;

  h2 {
    margin-top: 24px;
    font-size: 48px;
  }

  h3 {
    font-size: 32px;
  }
`

const ContinueButton = styled.div`
  color: #444;
  padding: 8px 16px;
  background: #fff;
  font-size: 20px;
  width: 300px;
  margin: 0 auto;
  border-radius: 4px;
`

const TimesUpScreen = props => {
  const spring = useSpring({ top: 0, from: { top: -4000 } })

  return (
    <Container style={spring}>
      <h3>Time's up</h3>
      <h2>{renderWinnerText(props)}</h2>

      <PlayersTable players={props.players} />

      <a href="/" style={{ textDecoration: 'none' }}>
        <ContinueButton>Continue</ContinueButton>
      </a>
    </Container>
  )
}

const renderWinnerText = ({ players, winnerId, playerId }) => {
  const winner = players.find(({ id }) => id === winnerId)
  let ally = null

  if (winner.allyId && !winner.allyDied) {
    ally = players.find(({ id }) => id === winner.allyId)
  }

  if (winnerId === playerId) {
    if (ally) {
      return `You and ${ally.name} win the game!`
    } else {
      return 'You win the game!'
    }
  }

  if (ally) {
    if (ally.id === playerId) {
      return `You and ${winner.name} win the game!`
    } else {
      return `${winner.name} and ${ally.name} win the game!`
    }
  } else {
    return `${winner.name} wins the game!`
  }
}

export default TimesUpScreen
