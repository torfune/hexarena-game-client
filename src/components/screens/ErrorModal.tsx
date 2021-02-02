import styled from 'styled-components'
import { BOX_SHADOW, PRIMARY } from '../../constants/react'
import React from 'react'
import getGameClientUrl from '../../utils/getWebClientUrl'
import Button from '../Button'
import getWebClientUrl from '../../utils/getWebClientUrl'

interface Props {
  message: string
  goHome: boolean
}
const ErrorModal: React.FC<Props> = ({ message, goHome }) => (
  <>
    <BlackOverlay />

    <Container>
      <h2>{message}</h2>

      <a href={getWebClientUrl()}>
        <StyledButton>Continue</StyledButton>
      </a>
    </Container>
  </>
)

const WIDTH = 500

const Container = styled.div`
  position: absolute;
  top: 200px;
  width: ${WIDTH}px;
  background: #222;
  color: #fff;
  text-align: center;
  padding-top: 80px;
  padding-bottom: 80px;
  left: 50vw;
  transform: translateX(-${WIDTH / 2}px);
  box-shadow: ${BOX_SHADOW};
  border-radius: 16px;
  z-index: 12;

  h2 {
    font-size: 24px;
    color: #fff;
    font-weight: 600;
  }
`
const StyledButton = styled(Button)`
  margin: 48px auto 0 auto;
`
const BlackOverlay = styled.div`
  background: #000;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  opacity: 0.6;
  z-index: 11;
`

export default ErrorModal
