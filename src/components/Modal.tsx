import styled from 'styled-components'
import { BOX_SHADOW, COLOR, Z_INDEX } from '../constants/constants-react'
import React, { FC } from 'react'

interface Props {
  width: number
  title?: string
}
const Modal: FC<Props> = ({ width, title, children }) => (
  <>
    <Container width={width}>
      {title && <h2>{title}</h2>}
      {children}
    </Container>

    <ScreenOverlay />
  </>
)

const Container = styled.div<{ width: number }>`
  position: absolute;
  top: 200px;
  width: ${(props) => props.width}px;
  background: ${COLOR.GREY_800};
  text-align: center;
  padding-top: 64px;
  padding-bottom: 64px;
  left: 50vw;
  transform: translateX(-${(props) => props.width / 2}px);
  box-shadow: ${BOX_SHADOW};
  border-radius: 16px;
  z-index: ${Z_INDEX.MODAL + 1};

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
  background: #000;
  opacity: 0.4;
  z-index: ${Z_INDEX.MODAL};
`

export default Modal
