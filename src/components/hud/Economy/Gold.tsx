import React from 'react'
import styled from 'styled-components'
import Label from './Label'
import { observer } from 'mobx-react-lite'
import store from '../../../store'
import { COLOR } from '../../../constants/react'

const Container = styled.div`
  border-left: 1px solid ${COLOR.HUD_BORDER};
  padding: 16px 20px 8px 20px;
  text-align: right;
  width: 130px;
`

const Value = styled.p`
  font-size: 48px;
  letter-spacing: 2px;
  font-weight: 500;
  color: #fff;
`

const Gold = () => {
  if (!store.game || !store.game.player) return null

  return (
    <Container>
      <Label>Gold</Label>
      <Value>{store.game.player.gold}</Value>
    </Container>
  )
}

export default observer(Gold)
