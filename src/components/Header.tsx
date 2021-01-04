import styled from 'styled-components'
import React from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import store from '../store'
import { BREAKPOINT, Z_INDEX } from '../constants/react'

const Container = styled.div`
  width: 100vw;
  z-index: ${Z_INDEX.HEADER};
  position: fixed;
  top: 0;
  display: flex;
  background: #111111f8;
  padding: 0 48px;
  height: 60px;
  justify-content: flex-end;
  align-items: center;
  color: #fff;
  border-top: 4px solid #b72b0a;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
`

const Logo = styled.h1`
  font-size: 1.5rem;
  font-weight: 600;
  color: #fff;
  display: flex;
  align-items: center;

  > a {
    color: #fff;
  }

  > img {
    width: 22px;
    margin-right: 12px;
    filter: invert(1);
  }

  @media (max-width: ${BREAKPOINT.FINAL}) {
    font-size: 32px;
    justify-content: center;

    > img {
      height: 23px;
      margin-right: 8px;
    }
  }
`

const DiscordLink = styled.a`
  color: #fff;
  margin-left: 16px;
  border-left: 1px solid #fff;
  padding-left: 16px;
`

const LeftSection = styled.div`
  margin-right: auto;
  display: flex;
  align-items: center;

  @media (max-width: ${BREAKPOINT.FINAL}) {
    margin-right: 0;
    width: 100%;
    justify-content: center;
  }
`

const Header = () => (
  <Container>
    <LeftSection>
      <Logo>
        <img src="/static/images/castle-icon.png" />
        {store.game && !store.spectating ? (
          <a href="/">HexArena.io</a>
        ) : (
          <Link to="/">HexArena.io</Link>
        )}
      </Logo>
    </LeftSection>

    <DiscordLink target="_blank" href="https://discord.gg/vwXKyRX">
      Discord
    </DiscordLink>
  </Container>
)

export default observer(Header)
