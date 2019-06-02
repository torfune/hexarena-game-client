import styled from 'styled-components'
import { PRIMARY, SECONDARY } from '../../../constants/react'
import React from 'react'

const Container = styled.div`
  background: ${PRIMARY};
  color: #fff;
  font-size: 20px;
  font-weight: 600;
  padding: 8px 64px;
  border-radius: 4px;
  width: 260px;
  margin: 0 16px;
  transition: 100ms;
  position: absolute;
  bottom: 128px;
  left: 50vw;
  transform: translateX(-130px);
  text-align: center;
  box-shadow: 0px 4px 16px #00000022;
  z-index: 10;

  :hover {
    background: ${SECONDARY};
  }
`

const SpectateCloseButton = () => (
  <a href="/game">
    <Container>Play again</Container>
  </a>
)

export default SpectateCloseButton
