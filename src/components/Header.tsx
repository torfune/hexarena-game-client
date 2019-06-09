import styled from 'styled-components'
import React from 'react'
import { version } from '../../package.json'

const Container = styled.div`
  width: 100vw;
  z-index: 2;
  position: fixed;
  top: 0;
  display: flex;
  background: #222;
  padding: 0 64px;
  height: 80px;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid #111;
  color: #fff;
`

const Logo = styled.a`
  > h1 {
    font-size: 42px;
    color: #fff;
  }

  margin-right: auto;
`

const Version = styled.p`
  font-size: 28px;
  margin-left: 32px;
  padding-left: 32px;
  border-left: 1px solid #fff;
  font-weight: 200;
`

const Description = styled.p`
  font-size: 28px;
  font-weight: 200;
`

const Header = () => (
  <Container>
    <Logo href="/">
      <h1>HexArena.io</h1>
    </Logo>

    <Description>Multiplayer strategy game</Description>
    <Version>{version}</Version>
  </Container>
)

export default Header
