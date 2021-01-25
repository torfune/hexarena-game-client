import React from 'react'
import styled from 'styled-components'
import getHudScale from '../../utils/getHudScale'
import { COLOR, PRIMARY } from '../../constants/react'
import goalIcon from '../../icons/goal.svg'

const Tutorial = () => (
  <Container>
    <Row>
      <Heading>Goal</Heading>
      <Icon src={goalIcon} />
    </Row>
    <GoalMessage>
      Capture <span>red player's</span> Capital to finish tutorial.
    </GoalMessage>
  </Container>
)

const Container = styled.div`
  background: ${COLOR.HUD_BACKGROUND};
  top: 0;
  right: 0;
  width: 380px;
  position: absolute;
  user-select: none;
  border-bottom-left-radius: 8px;
  border-bottom: 1px solid ${COLOR.HUD_BORDER};
  border-left: 1px solid ${COLOR.HUD_BORDER};
  overflow: hidden;
  padding-top: 16px;
  padding-bottom: 16px;

  /* Resolution scaling */
  transform-origin: left top;
  transform: scale(${getHudScale()});
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

const Heading = styled.p`
  text-transform: uppercase;
  margin-bottom: 12px;
  margin-left: 24px;
  font-weight: 600;
  color: #ccc;
  font-size: 16px;
`

const Icon = styled.img`
  height: 22px;
  opacity: 0.8;
  margin-left: auto;
  margin-right: 24px;
  filter: invert(1);
`

const GoalMessage = styled.p`
  color: #fff;
  font-size: 24px;
  font-weight: 600;
  padding: 0 24px;
  margin-top: 16px;

  > span {
    color: ${PRIMARY};
  }
`

export default Tutorial
