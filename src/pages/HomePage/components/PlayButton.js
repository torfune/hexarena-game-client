import React from 'react'
import styled from 'styled-components'

import { Link } from '@reach/router'

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

const PlayButton = () => (
  <Link to="/game">
    <StyledButton>Play</StyledButton>
  </Link>
)

export default PlayButton
