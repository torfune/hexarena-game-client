import React from 'react'
import styled from 'styled-components'
import { Link } from '@reach/router'

import { GOOGLE_PRIMARY } from '../../../constants'

const StyledButton = styled(Link)`
  background: ${GOOGLE_PRIMARY};
  border: 1px solid ${GOOGLE_PRIMARY};
  width: 120px;
  border-radius: 4px;
  font-size: 16px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  box-sizing: border-box;
  color: #fff;
  transition: 0.2s;
  text-align: center;

  :hover {
    padding-left: 8px;
    opacity: 0.9;
  }
`

const PlayButton = () => <StyledButton to="game">Play</StyledButton>

export default PlayButton
