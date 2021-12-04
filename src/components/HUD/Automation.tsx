import { observer } from 'mobx-react-lite'
import styled, { css } from 'styled-components'
import store from '../../core/store'
import React from 'react'
import { COLOR } from '../../constants/constants-react'
import skullIcon from '../../icons/skull.svg'
import botIcon from '../../icons/bot.svg'
import Player from '../../core/classes/Player'
import getPlayerGroups from '../../utils/getPlayerGroups'
import formatMode from '../../utils/formatMode'

const Automation = observer(() => {
  if (!store.game) return null

  function cancelAutomation() {
    if (store.socket) {
      store.socket.send('cancelAllAutomation')
    }
  }

  return (
    <Container>
      <Heading>AUTOMATION</Heading>

      <InfoText>
        - Hold <b>[space]</b> while sending <b>Army</b> to create{' '}
        <b>Supply line</b>.
      </InfoText>

      <InfoText>
        - Click again on <b>Building</b> that is making new <b>Army</b> to setup{' '}
        <b>Automatic training</b>.
      </InfoText>

      <CancelAutomationButton onClick={cancelAutomation}>
        Cancel all automation [x]
      </CancelAutomationButton>
    </Container>
  )
})

const Container = styled.div`
  background: ${COLOR.GREY_600}ee;
  bottom: 0;
  left: 0;
  position: absolute;
  user-select: none;
  border-top-right-radius: 4px;
  border-top: 1px solid ${COLOR.GREY_800};
  border-right: 1px solid ${COLOR.GREY_800};
  max-width: 260px;
  padding: 8px;
`
const Heading = styled.p`
  margin-bottom: 6px;
  font-weight: 600;
  color: #fff;
  opacity: 0.5;
  font-size: 10px;
  letter-spacing: 1px;
  display: flex;
  justify-content: space-between;
`
const InfoText = styled.p`
  color: white;
  font-size: 14px;
  margin-bottom: 6px;
`
const CancelAutomationButton = styled.div`
  background: ${COLOR.GREY_400};
  font-weight: 600;
  font-size: 12px;
  color: #fff;
  letter-spacing: 1px;
  text-transform: uppercase;
  padding: 8px 0;
  border-radius: 2px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8px;

  :hover {
    background: ${COLOR.GREY_200};
  }
`

export default Automation
