import styled from 'styled-components'
import React from 'react'
import Button from './Button'
import getWebClientUrl from '../utils/getWebClientUrl'
import isSpectating from '../utils/isSpectating'
import cancelSpectate from '../utils/cancelSpectate'
import Modal from './Modal'

interface Props {
  message: string
}
const ErrorModal: React.FC<Props> = ({ message }) => (
  <Modal width={500} title={message}>
    {isSpectating() ? (
      <StyledButton onClick={cancelSpectate}>Continue</StyledButton>
    ) : (
      <a href={getWebClientUrl()}>
        <StyledButton>Continue</StyledButton>
      </a>
    )}
  </Modal>
)

const StyledButton = styled(Button)`
  margin: 48px auto 0 auto;
`

export default ErrorModal
