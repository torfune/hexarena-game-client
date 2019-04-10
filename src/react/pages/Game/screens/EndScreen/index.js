import React from 'react'
import styled from 'styled-components'
import { useSpring, animated } from 'react-spring'
import PlayersTable from './PlayersTable'
import { PRIMARY } from '../../../../constants'

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

  h3 {
    font-size: 48px;
    font-weight: 700;
  }
`

const WhiteWrapper = styled.div`
  background: #fff;
  padding: 32px 0;
  margin: 64px auto;
  width: 420px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

const ContinueButton = styled.div`
  color: #fff;
  padding: 8px 16px;
  background: ${PRIMARY};
  font-size: 20px;
  width: 256px;
  margin: 64px auto 0 auto;
  border-radius: 4px;
  box-shadow: 0px 6px 16px #00000011;
  transition: 200ms;

  :hover {
    transform: scale(1.05);
  }
`

const EndScreen = () => {
  const spring = useSpring({ top: 0, from: { top: -4000 } })

  return (
    <Container style={spring}>
      <h3>The game has finished!</h3>

      <WhiteWrapper>
        <PlayersTable />

        <a href="/">
          <ContinueButton>Continue</ContinueButton>
        </a>
      </WhiteWrapper>
    </Container>
  )
}

export default EndScreen
