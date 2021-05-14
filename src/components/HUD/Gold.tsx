import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../core/store'
import React from 'react'
import { COLOR } from '../../constants/constants-react'
import getHudScale from '../../utils/getHudScale'
import Label from './Economy/Label'

const Gold = observer(() => {
  if (!store.game || !store.game.player) return null

  return (
    <Container>
      <Content>
        <Label>Gold</Label>
        <Value>{store.game.player.gold}</Value>
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
const Content = styled.div`
  margin: 0 auto;
  background: ${COLOR.GREY_600};
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  border: 1px solid ${COLOR.GREY_800};
  border-top: none;
  padding: 6px;
  text-align: center;
  user-select: none;
  width: 128px;
  transition: 200ms;
  font-weight: bold;

  /* Resolution scaling */
  transform-origin: center top;
  transform: scale(${getHudScale()});
`
const Value = styled.p`
  color: #fff;
  font-size: 32px;
`

export default Gold
