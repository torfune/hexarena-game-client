import { PopIn } from './Animations'
import styled from 'styled-components'
import { BOX_SHADOW } from '../constants/react'
import React, { FC } from 'react'

interface Props {
  width: number
  title: string
}
const Modal: FC<Props> = ({ width, title, children }) => (
  <PopIn>
    <ScreenOverlay />

    <Container width={width}>
      <h2>{title}</h2>

      {children}
    </Container>
  </PopIn>
)

const Container = styled.div<{ width: number }>`
  position: absolute;
  top: 200px;
  width: ${(props) => props.width}px;
  background: #222;
  text-align: center;
  padding-top: 80px;
  padding-bottom: 80px;
  left: 50vw;
  transform: translateX(-${(props) => props.width / 2}px);
  box-shadow: ${BOX_SHADOW};
  border-radius: 16px;
  z-index: 10;

  h2 {
    font-size: 24px;
    color: #fff;
    font-weight: 600;
  }
`
const ScreenOverlay = styled.div`
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  background: #000000;
  opacity: 0.2;
`

export default Modal
