import styled from 'styled-components'
import React from 'react'
import getWebClientUrl from '../utils/getWebClientUrl'
import Button from './Button'

const PageNotFound = () => {
  return (
    <Container>
      <p>404 - Page not found</p>
      <a href={getWebClientUrl()}>
        <StyledButton>Continue</StyledButton>
      </a>
    </Container>
  )
}

const Container = styled.div`
  margin-top: 128px;
  color: white;
  font-size: 24px;
  text-align: center;
`
const StyledButton = styled(Button)`
  margin: 48px auto 0 auto;
`

export default PageNotFound
