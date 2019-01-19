import React from 'react'
import styled from 'styled-components'

import PlayButton from './components/PlayButton'
import RegionSelector from './components/RegionSelector'
import LoginButton from './components/LoginButton'
import ScoreBoard from './components/Scoreboard'
import AdSpace from './components/AdSpace'
import NameInput from './components/NameInput'

import { Link } from '@reach/router'

const Container = styled.div`
  margin: 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 48px;
`

const InputAndButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`
const LoginButtonsContainer = styled.div`
  padding: 16px;
`

const AnchorContainer = styled.div`
  padding: 16px;
`

const Anchor = styled.a`
  margin: 16px 8px 0 8px;
  font-weight: bold;
  color: #e74c3c;
  text-decoration: none;
`

const Text = styled.p`
  margin: 16px 0 0 0;
  color: #333;
`

const HomePage = () => (
  <Container>
    <AdSpace />
    <InputAndButtonsContainer>
      <NameInput />
      <PlayButton />
      <RegionSelector />
      <LoginButtonsContainer>
        <LoginButton type="Facebook" />
        <LoginButton type="Google" />
      </LoginButtonsContainer>
      <AnchorContainer>
        <Link to="/marketplace" style={{ textDecoration: 'none' }}>
          <Anchor>marketplace</Anchor>
        </Link>
        <Anchor href="https://www.reddit.com/r/Hexagorio/">reddit</Anchor>
        <Link to="/blog" style={{ textDecoration: 'none' }}>
          <Anchor>blog</Anchor>
        </Link>
      </AnchorContainer>
      <Link to="/contact" style={{ textDecoration: 'none' }}>
        <Text>Created by Matej Strnad & Katarina Cvetkovicova</Text>
      </Link>
    </InputAndButtonsContainer>
    <ScoreBoard />
  </Container>
)

export default HomePage
