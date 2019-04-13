import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'
import { PRIMARY, SECONDARY } from 'constants/react'

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
  <Link href="/">
    <a>
      <Container>Close</Container>
    </a>
  </Link>
)

export default SpectateCloseButton
