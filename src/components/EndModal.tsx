import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import store from '../core/store'
import React from 'react'
import getWebClientUrl from '../utils/getWebClientUrl'
import isSpectating from '../utils/isSpectating'
import cancelSpectate from '../utils/cancelSpectate'
import Modal from './Modal'
import Button from './Button'

const EndScreen = () => {
  if (!store.game || store.game.time === null) return null

  let title = 'Game has finished.'
  if (store.game.time === 0) {
    title = `Time's up! Game ended in draw.`
  }

  return (
    <Modal width={500} title={title}>
      {isSpectating() ? (
        <StyledButton onClick={cancelSpectate}>Continue</StyledButton>
      ) : (
        <a href={getWebClientUrl()}>
          <StyledButton>Continue</StyledButton>
        </a>
      )}
    </Modal>
  )
}

const StyledButton = styled(Button)`
  margin: 48px auto 0 auto;
`

export default observer(EndScreen)
