import { observer } from 'mobx-react-lite'
import { PRIMARY } from '../../../../constants'
import Ally from './Ally'
import game from '../../../../../game'
import Header from '../../../../shared/Header'
import Label from '../../../../shared/Label'
import List from './List'
import playerSrc from '../../../../../assets/icons/player.svg'
import React, { Fragment, useState, useEffect, useRef } from 'react'
import store from '../../../../../store'
import styled from 'styled-components'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  bottom: 0;
  right: 256px;
  width: 300px;
  position: absolute;
  user-select: none;
  border-top-left-radius: 8px;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  overflow: hidden;
`

const Content = styled.div`
  padding: 0 30px;
`

const ToggleButton = styled.div`
  background: ${props => props.color};
  color: #fff;
  text-transform: uppercase;
  padding: 8px 0;
  text-align: center;
  font-weight: 600;
  border-radius: 2px;
  font-size: 14px;
  margin-top: 20px;
  margin-bottom: 12px;

  :hover {
    opacity: 0.9;
  }
`

const Diplomacy = observer(() => {
  const { players, player, allianceRequests } = store

  const [sendingRequest, setSendingRequest] = useState(false)
  const containerRef = useRef(null)

  useEffect(() => {
    containerRef.current.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      containerRef.current.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  const handleMouseLeave = () => {
    setSendingRequest(false)
  }

  const handleButtonClick = () => {
    setSendingRequest(!sendingRequest)
  }

  const handleCreate = id => {
    setSendingRequest(false)
    game.createRequest(id)
  }

  const handleAccept = id => {
    game.acceptRequest(id)
  }

  const handleDecline = id => {
    game.declineRequest(id)
  }

  const requests = {
    sent: allianceRequests.filter(r => r.senderId === player.id),
    received: allianceRequests.filter(r => r.receiverId === player.id),
  }

  return (
    <Container ref={containerRef}>
      <Header
        text={player.ally ? 'Alliance' : 'Diplomacy'}
        iconSrc={playerSrc}
        iconSize="24px"
      />
      <Content>
        {player.ally ? (
          <Ally ally={player.ally} />
        ) : (
          <Fragment>
            <Label>
              {sendingRequest ? 'Select player' : 'Alliance requests'}
            </Label>

            <List
              playerId={player.id}
              players={players}
              requests={requests}
              sendingRequest={sendingRequest}
              onAccept={handleAccept}
              onCreate={handleCreate}
              onDecline={handleDecline}
            />

            <ToggleButton
              onClick={handleButtonClick}
              color={sendingRequest ? PRIMARY : '#0097e6'}
            >
              {sendingRequest ? 'Cancel' : 'Send request'}
            </ToggleButton>
          </Fragment>
        )}
      </Content>
    </Container>
  )
})

export default Diplomacy
