import React, { FC } from 'react'
import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import store from '../../store'
import Button from '../../components/Button'
import renderPlayers from './renderPlayers'
import renderEndStatement from './renderEndStatement'
import { PRIMARY } from '../../constants/react'
import { animated } from 'react-spring'

interface Props {
  style: any
}
const Modal: FC<Props> = ({ style }) => {
  if (!store.game) return null

  const goHome = () => {
    if (window.location.href.includes('localhost')) {
      window.location.href = 'http://localhost:3000'
    } else {
      window.location.href = '/'
    }
  }

  const players = Array.from(store.game.players.values())

  return (
    <Container style={style}>
      {renderEndStatement(players)}
      <Players>{renderPlayers(players)}</Players>
      <Button onClick={goHome} color={PRIMARY}>
        Continue
      </Button>
    </Container>
  )
}

const Container = styled(animated.div)`
  width: 580px;
  background: #222;
  padding: 64px 0;
  position: absolute;
  left: calc(50vw - 290px);
  top: 25vh;
  border-radius: 24px;
  z-index: 11;
  box-shadow: rgba(0, 0, 0, 0.5) 0px 4px 64px;
`

const Players = styled.div`
  display: flex;
  justify-content: center;
  margin: 64px 0;
`

export default observer(Modal)
