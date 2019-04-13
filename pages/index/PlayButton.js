import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import {
  PRIMARY,
  BOX_SHADOW,
  SECONDARY,
  TEXT_SHADOW,
} from '../../constants/react'

const StyledButton = styled.a`
  background: ${PRIMARY};
  width: 190px;
  border-radius: 4px;
  font-size: 16px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #fff;
  text-align: center;
  font-weight: 500;
  box-shadow: ${BOX_SHADOW};
  text-shadow: ${TEXT_SHADOW};
  cursor: default;
  position: relative;
  margin-left: 16px;

  :hover {
    background: ${SECONDARY};
    color: #eee;
  }
`

const PlayButton = () => (
  <Link href="game">
    <StyledButton>Play</StyledButton>
  </Link>
)

export default PlayButton
