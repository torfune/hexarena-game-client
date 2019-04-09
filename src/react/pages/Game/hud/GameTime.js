import React from 'react'
import styled from 'styled-components'
import store from '../../../../store'
import { HUD_SCALE } from '../../../constants'
import { observer } from 'mobx-react-lite'

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
`

const Content = styled.div`
  margin: 0 auto;
  background: #555;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border-top: none;
  box-shadow: 0px 2px 6px #00000022;
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  padding: 4px 0;
  text-align: center;
  user-select: none;
  width: 128px;

  /* Resolution scaling */
  transform-origin: center top;
  transform: scale(${HUD_SCALE});
`

const GameTime = observer(() => {
  if (!store.gameTime) return null

  const minutes = String(Math.floor(store.gameTime / 60)).padStart(2, '0')
  const seconds = String(store.gameTime - minutes * 60).padStart(2, '0')

  return (
    <Container>
      <Content>
        {minutes}:{seconds}
      </Content>
    </Container>
  )
})

export default GameTime
