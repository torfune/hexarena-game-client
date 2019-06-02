import styled from 'styled-components'
import { BOX_SHADOW, PRIMARY } from '../../../constants/react'
import React from 'react'

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
  z-index: 10;

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

const BlackOverlay = styled.div`
  background: #000;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  opacity: 0.6;
  z-index: 9;
`

interface Props {
  message: string
  goHome: boolean
}
const ErrorModal: React.FC<Props> = ({ message, goHome }) => (
  <>
    <BlackOverlay />

    <Container>
      <h2>{message}</h2>

      <StyledButton
        onClick={() => {
          if (!goHome) {
            window.location.reload()
          } else {
            window.location.href = '/'
          }
        }}
      >
        {goHome ? 'Continue' : 'Reload'}
      </StyledButton>
    </Container>
  </>
)

export default ErrorModal
