import styled from 'styled-components'
import React from 'react'
import { PRIMARY, COLOR } from '../../../constants/react'
import store from '../../../store'
import getHudScale from '../../../utils/getHudScale'
// import Icon from '../../../components/'

const Container = styled.div`
  background: ${COLOR.HUD_BACKGROUND};
  top: 0;
  left: 0;
  width: 200px;
  position: absolute;
  user-select: none;
  border-bottom-right-radius: 8px;
  border-bottom: 1px solid ${COLOR.HUD_BORDER};
  border-right: 1px solid ${COLOR.HUD_BORDER};
  overflow: hidden;
  padding: 16px;

  /* Resolution scaling */
  transform-origin: left top;
  transform: scale(${getHudScale()});
`

const Button = styled.div`
  background: #666;
  font-weight: 600;
  font-size: 12px;
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 8px 0px;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    background: ${PRIMARY};
  }
`

const Icon = styled.img`
  filter: invert(1);
  height: 12px;
  margin-right: 8px;
`

const Surrender = () => {
  if (!store.game) return null

  return (
    <Container>
      <Button onClick={store.game.surrender.bind(store.game)}>
        <Icon src="/static/icons/flag.svg" />
        <span>Surrender</span>
      </Button>
    </Container>
  )
}

export default Surrender
