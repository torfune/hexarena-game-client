import Spinner from './Spinner'
import styled from 'styled-components'
import React from 'react'
import { Z_INDEX } from '../constants/constants-react'

const ReconnectingOverlay = () => {
  return (
    <Container>
      <p>Reconnecting</p>
      <Spinner size="48px" thickness="2px" color="#fff" />
    </Container>
  )
}

const Container = styled.div`
  background: rgba(0, 0, 0, 0.5);
  width: 256px;
  z-index: ${Z_INDEX.MODAL};
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  top: 200px;
  text-align: center;
  padding-top: 48px;
  padding-bottom: 48px;
  left: 50vw;
  transform: translateX(-128px);
  border-radius: 16px;
  z-index: ${Z_INDEX.MODAL + 1};

  > p {
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 32px;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
`

export default ReconnectingOverlay
