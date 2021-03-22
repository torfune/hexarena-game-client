import styled from 'styled-components'
import React from 'react'
import { COLOR } from '../../constants/constants-react'
import { observer } from 'mobx-react-lite'
import store from '../../core/store'
import getHudScale from '../../utils/getHudScale'
import spectateIcon from '../../icons/spectate.svg'

const SpectatorCount = () => {
  if (!store.game || !store.game.spectators) return null

  return (
    <Container>
      <Icon src={spectateIcon} />
      <Number>{store.game.spectators}</Number>
    </Container>
  )
}

const Container = styled.div`
  background: ${COLOR.GREY_600};
  width: 90px;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  border-bottom-left-radius: 8px;
  border-bottom: 1px solid ${COLOR.GREY_800};
  border-left: 1px solid ${COLOR.GREY_800};
  padding-top: 6px;
  padding-bottom: 6px;

  /* Resolution scaling */
  transform-origin: right top;
  transform: scale(${getHudScale()});
`

const Icon = styled.img`
  height: 24px;
  filter: invert(1);
  opacity: 0.5;
`
const Number = styled.div`
  text-align: center;
  color: #fff;
  font-size: 32px;
  font-weight: 300;
`

export default observer(SpectatorCount)
