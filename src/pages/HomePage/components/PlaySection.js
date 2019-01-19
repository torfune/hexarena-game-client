import React from 'react'
import styled from 'styled-components'

import { Link } from '@reach/router'

const Container = styled.div`
  margin-top: 64px;
  padding: 0 16px;
`

const StyledButton = styled.button`
  margin-top: 16px;
  width: 72px;
  background: #f33;
  border: 1px solid #fff;
  border-radius: 8px;
  background: #d63031;
  font-size: 18px;
  color: #fff;
  padding: 4px;
`

const Header = styled.h3`
  font-size: 24px;
`

const PlaySection = () => (
  <Container>
    <Header>Login &amp; Play</Header>
    <Link to="/game">
      <StyledButton>Play</StyledButton>
    </Link>
  </Container>
)

export default PlaySection
