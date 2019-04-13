import { observer } from 'mobx-react-lite'
import { PRIMARY } from 'constants/react'
import { useSpring, animated } from 'react-spring'
import React from 'react'
import renderWinStatement from './renderWinStatement'
import store from 'store'
import styled from 'styled-components'
import Table from './Table'
import getPlayerGroups from 'utils/getPlayerGroups'

const Container = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #00000088;
  border-bottom: 1px solid #222;
`

const Box = styled.div`
  background: #333;
  padding: 60px 0;
  margin: 0 auto;
  width: 1000px;
  height: 100vh;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  text-align: center;
  box-shadow: 0px 1px 24px #00000033;
  position: relative;
`

const WinStatement = styled.p`
  margin-top: 20px;
  color: #fff;
  text-align: center;
  font-style: italic;

  span {
    color: ${PRIMARY};
    font-weight: 700;
    text-shadow: 0px 1px 6px #00000022;
    font-size: 17px;
    font-style: normal;
  }
`

const RedSheet = styled.div`
  background: ${PRIMARY};
  width: 56px;
  height: 400px;
  left: ${props => props.left};
  right: ${props => props.right};
  position: absolute;
  top: -2px;
  box-shadow: 0px 4px 16px #00000033;
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
`

const Heading = styled.p`
  font-size: 34px;
  font-weight: 700;
  color: #fff;
`

const ContinueButton = styled.a`
  background: ${PRIMARY};
  border-radius: 4px;
  box-shadow: 0px 4px 16px #00000033;
  color: #fff;
  font-size: 20px;
  margin: 60px auto 0 auto;
  padding: 10px 16px;
  transition: 200ms;
  width: 320px;
  font-weight: 600;

  :hover {
    transform: scale(1.05);
  }
`

const EndScreen = () => {
  const spring = useSpring({ top: 0, from: { top: -4000 } })
  const groups = getPlayerGroups(store.players)

  return (
    <Container style={spring}>
      <Box>
        <Heading>The game has finished!</Heading>
        <WinStatement>{renderWinStatement(groups[0])}</WinStatement>

        <Table groups={groups} />

        <ContinueButton href="/">Continue</ContinueButton>

        <RedSheet left="80px" />
        <RedSheet right="80px" />
      </Box>
    </Container>
  )
}

export default observer(EndScreen)
