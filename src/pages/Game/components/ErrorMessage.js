import React from 'react'
import styled from 'styled-components'

const StyledText = styled.p`
  margin-top: 256px;
  text-align: center;
  font-size: 24px;
  font-weight: 500;
`

const ErrorMessage = ({ children }) => <StyledText>{children} :(</StyledText>

export default ErrorMessage
