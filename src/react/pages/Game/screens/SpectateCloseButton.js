import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'
import { PRIMARY, SECONDARY } from '../../../constants'

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

  :hover {
    background: ${SECONDARY};
  }
`

const SpectateCloseButton = () => (
  <Link to="/">
    <Container>Close</Container>
  </Link>
)

export default SpectateCloseButton
