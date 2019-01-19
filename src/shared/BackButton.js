import React from 'react'
import styled from 'styled-components'

import { Link } from '@reach/router'

import back from './back.svg'

const StyledBackButton = styled.img`
  height: 48px;
  width: 48px;
  position: absolute;
  left: 16px;
  top: 16px;
`

const BackButton = () => (
  <Link to="/">
    <StyledBackButton src={back} alt="back-button" />
  </Link>
)

export default BackButton
