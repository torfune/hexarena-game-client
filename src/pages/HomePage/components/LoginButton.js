import React from 'react'
import styled from 'styled-components'

import { FACEBOOK_PRIMARY, GOOGLE_PRIMARY } from '../../../constants'
import googleIcon from '../../../icons/google.svg'
import facebookIcon from '../../../icons/facebook.svg'

const StyledButton = styled.button`
  border: 1px solid #ccc;
  background: #fff;
  margin-right: 16px;
  border-radius: 4px;
  padding: 6px 16px;
  display: flex;
  transition: background-color 0.1s;

  span {
    font-size: 16px;
    font-weight: 500;
    margin-left: 16px;
    padding-left: 16px;
    margin-right: 4px;
    border-left: 1px solid #ccc;
  }

  :hover {
    background: ${({ color }) => color};
    border-color: ${({ color }) => color};

    span {
      color: #fff;
      border-color: #fff;
    }

    img {
      filter: invert(1);
    }
  }
`

const Icon = styled.img`
  height: 20px;
`

const LoginButton = ({ type }) => {
  if (type === 'google') {
    return (
      <StyledButton color={GOOGLE_PRIMARY}>
        <Icon src={googleIcon} />
        <span>Google</span>
      </StyledButton>
    )
  }

  if (type === 'facebook') {
    return (
      <StyledButton color={FACEBOOK_PRIMARY}>
        <Icon src={facebookIcon} />
        <span>Facebook</span>
      </StyledButton>
    )
  }

  return null
}

export default LoginButton
