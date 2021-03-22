import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../core/store'
import React from 'react'
import { COLOR } from '../../constants/constants-react'
import getHudScale from '../../utils/getHudScale'

const GameTime = observer(() => {
  if (!store.game || store.game.time === null) return null

  const minutes = Math.floor(store.game.time / 60)
  const seconds = store.game.time - minutes * 60
  const formatted = {
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
  }

  return (
    <Container>
      <Content lessThanMinute={minutes < 1}>
        {formatted.minutes}:{formatted.seconds}
      </Content>
    </Container>
  )
})

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
`
const Content = styled.div<{ lessThanMinute: boolean }>`
  margin: 0 auto;
  background: ${(props) => (props.lessThanMinute ? COLOR.RED : COLOR.GREY_600)};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  box-shadow: ${(props) =>
    props.lessThanMinute ? 'rgba(0, 0, 0, 0.2) 0px 1px 4px' : null};
  border: ${(props) =>
    props.lessThanMinute ? `none` : `1px solid ${COLOR.GREY_800}`};
  border-top: none;
  color: #fff;
  font-size: ${(props) => (props.lessThanMinute ? '28px' : '18px')};
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

export default GameTime
