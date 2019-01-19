import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
  margin: 16px 8px 0 8px;
  width: 156px;
  background: #f33;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #fff;
  font-size: 18px;
  padding: 4px;
`

const LoginButton = ({ type }) => <StyledButton>{type}</StyledButton>

export default LoginButton
