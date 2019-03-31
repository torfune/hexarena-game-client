import React, { Fragment, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Ally from './Ally'
import List from './List'
import Header from '../../../../shared/Header'
import Label from '../../../../shared/Label'
import playerSrc from '../../../../../assets/icons/player.svg'
import { PRIMARY } from '../../../../constants'

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

const Diplomacy = ({
  requests,
  players,
  playerId,
  ally,
  allyDied,
  acceptRequest,
  declineRequest,
  createRequest,
}) => {
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

  const handleCreate = id => {
    createRequest(id)
    setSendingRequest(false)
  }

  const handleButtonClick = () => {
    setSendingRequest(!sendingRequest)
  }

  return (
    <Container ref={containerRef}>
      <Header
        text={ally ? 'Alliance' : 'Diplomacy'}
        iconSrc={playerSrc}
        iconSize="24px"
      />
      <Content>
        {ally ? (
          <Ally ally={ally} died={allyDied} />
        ) : (
          <Fragment>
            <Label>
              {sendingRequest ? 'Select player' : 'Alliance requests'}
            </Label>

            <List
              requests={requests}
              players={players}
              playerId={playerId}
              sendingRequest={sendingRequest}
              onAccept={acceptRequest}
              onDecline={declineRequest}
              onCreate={handleCreate}
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
}

export default Diplomacy
