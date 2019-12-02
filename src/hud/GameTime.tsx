import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../store'
import React from 'react'
import { COLOR, SECONDARY } from '../constants/react'
import getHudScale from '../utils/getHudScale'

const Container = styled.div<{ spectating: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
`

const Content = styled.div<{ lessThenMinute: boolean }>`
  margin: 0 auto;
  background: ${props =>
    props.lessThenMinute ? SECONDARY : COLOR.HUD_BACKGROUND};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border: ${props =>
    props.lessThenMinute
      ? `1px solid ${SECONDARY}`
      : `1px solid ${COLOR.HUD_BORDER}`};
  border-top: none;
  color: #fff;
  font-size: ${props => (props.lessThenMinute ? '28px' : '18px')};
  font-weight: 600;
  padding: 4px 0;
  text-align: center;
  user-select: none;
  width: 128px;
  transition: 200ms;

  /* Resolution scaling */
  transform-origin: center top;
  transform: scale(${getHudScale()});
`

const GameTime = observer(() => {
  if (!store.game || store.game.time === null) return null

  const minutes = Math.floor(store.game.time / 60)
  const seconds = store.game.time - minutes * 60
  const formatted = {
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }

  return (
    <Container spectating={store.spectating}>
      <Content lessThenMinute={minutes < 1}>
        {formatted.minutes}:{formatted.seconds}
      </Content>
    </Container>
  )
})

export default GameTime
