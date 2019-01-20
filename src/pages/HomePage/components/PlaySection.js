import React from 'react'
import styled from 'styled-components'

import PlayButton from './PlayButton'
import LoginButton from './LoginButton'
import NameInput from './NameInput'
import Heading from './Heading'

const Container = styled.div`
  margin-top: 64px;
  padding: 0 16px;
  display: grid;
  grid-template-columns: 2fr 1fr;
`

const LoginButtonsContainer = styled.div`
  background: #fff;
  display: flex;
`

const InputAndButtonContainer = styled.div`
  background: #fff;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 16px;
`

const PlaySection = () => (
  <Container>
    <div>
      <Heading>Login &amp; Play</Heading>
      <LoginButtonsContainer>
        <LoginButton type="google" />
        <LoginButton type="facebook" />
      </LoginButtonsContainer>
    </div>
    <div>
      <Heading>Play as guest</Heading>
      <InputAndButtonContainer>
        <NameInput />
        <PlayButton />
      </InputAndButtonContainer>
    </div>
  </Container>
)

export default PlaySection
