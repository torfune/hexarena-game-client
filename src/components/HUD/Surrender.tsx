import styled from 'styled-components'
import React from 'react'
import { COLOR } from '../../constants/constants-react'
import store from '../../core/store'
import getHudScale from '../../utils/getHudScale'
import flagIcon from '../../icons/flag.svg'

const Container = styled.div`
  background: ${COLOR.GREY_600};
  top: 0;
  left: 0;
  width: 200px;
  position: absolute;
  user-select: none;
  border-bottom-right-radius: 8px;
  border-bottom: 1px solid ${COLOR.GREY_800};
  border-right: 1px solid ${COLOR.GREY_800};
  overflow: hidden;
  padding: 16px;

  /* Resolution scaling */
  transform-origin: left top;
  transform: scale(${getHudScale()});
`

const Button = styled.div`
  background: ${COLOR.GREY_400};
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
    background: ${COLOR.GREY_200};
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
        <Icon src={flagIcon} />
        <span>Surrender</span>
      </Button>
    </Container>
  )
}

export default Surrender
