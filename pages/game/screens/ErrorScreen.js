import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background: #fff;
  padding: 64px;
  margin-top: 256px;
`

const StyledText = styled.p`
  text-align: center;
  font-size: 24px;
  font-weight: 500;
`

const ErrorMessage = () => (
  <Container>
    <StyledText>Disconnected.</StyledText>
  </Container>
)

export default ErrorMessage
