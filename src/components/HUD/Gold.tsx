import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../core/store'
import React from 'react'
import { COLOR } from '../../constants/constants-react'
import goldIcon from '../../icons/gold.svg'

const Gold = observer(() => {
  if (!store.game || !store.game.player) return null

  return (
    <Container>
      <Content>
        <GoldIcon src={goldIcon} />
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
  background: ${COLOR.GREY_600}ee;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  border: 1px solid ${COLOR.GREY_800};
  border-top: none;
  user-select: none;
  width: 116px;
  padding: 2px;
  display: flex;
  align-items: center;
`
const GoldIcon = styled.img`
  height: 40px;
  margin-left: 14px;
`
const Value = styled.p`
  color: #fff;
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 1px;
  text-align: center;
  width: 50px;
`

export default Gold
