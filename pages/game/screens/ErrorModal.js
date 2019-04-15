import React from 'react'
import styled from 'styled-components'
import { BOX_SHADOW, PRIMARY } from 'constants/react'

const WIDTH = 500

const Container = styled.div`
  position: absolute;
  top: 200px;
  width: ${WIDTH}px;
  background: #fff;
  text-align: center;
  padding-top: 64px;
  padding-bottom: 64px;
  left: 50vw;
  transform: translateX(-${WIDTH / 2}px);
  box-shadow: ${BOX_SHADOW};
  border-radius: 16px;

  h2 {
    font-size: 24px;
    color: #222;
    font-weight: 600;
  }
`

const StyledButton = styled.div`
  background: ${PRIMARY};
  padding: 8px 16px;
  width: 200px;
  margin: 0 auto;
  margin-top: 48px;
  color: #fff;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  transition: 100ms;

  :hover {
    transform: scale(1.05);
  }
`

const ErrorModal = ({ message }) => (
  <Container>
    <h2>{message}</h2>

    <StyledButton
      onClick={() => {
        window.location.reload()
      }}
    >
      Reload
    </StyledButton>
  </Container>
)

export default ErrorModal
