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
  if (winnerId === playerId) {
    return 'You are the winner!'
  }

  const winner = players.find(({ id }) => id === winnerId)

  return `${winner.name} is the winner!`
}

export default TimesUpScreen
