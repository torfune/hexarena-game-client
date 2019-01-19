import React from 'react'
import styled from 'styled-components'

import PlayButton from './components/PlayButton'
import RegionSelector from './components/RegionSelector'
import LoginButton from './components/LoginButton'
import ScoreBoard from './components/Scoreboard'
import AdSpace from './components/AdSpace'
import NameInput from './components/NameInput'

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
  text-decoration: none;
  font-weight: bold;
  color: #e74c3c;
`

const Text = styled.p`
  margin: 16px 0 0 0;
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
        <Anchor href="/">marketplace</Anchor>
        <Anchor href="https://www.reddit.com/r/Hexagorio/">reddit</Anchor>
      </AnchorContainer>
      <Text>Created by Matej Strnad & Katarina Cvetkovicova</Text>
    </InputAndButtonsContainer>
    <ScoreBoard />
  </Container>
)

export default HomePage
