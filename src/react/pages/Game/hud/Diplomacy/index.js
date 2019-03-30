import React, { Fragment, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Ally from './Ally'
import List from './List'
import Header from '../../../../shared/Header'
import Label from '../../../../shared/Label'
import playerSrc from '../../../../../assets/icons/player.svg'
import { PRIMARY } from '../../../../constants'

const ally = {
  pattern: '#fbc531',
  name: 'Abrakaar23',
  tilesCount: 139,
}

// const ally = null

const playerId = 0

const players = [
  {
    id: 0,
    pattern: '#fbc531',
    name: 'Trumpeta22',
    tilesCount: 80,
  },
  {
    id: 1,
    pattern: '#f343ff',
    name: 'Franta',
    tilesCount: 83,
  },
  {
    id: 2,
    pattern: '#f34300',
    name: 'Adam',
    tilesCount: 10,
  },
  {
    id: 3,
    pattern: '#03c53f',
    name: 'matej1111',
    tilesCount: 203,
  },
]

const requests = [
  {
    timeout: 0.8,
    sender: {
      id: 1,
      pattern: '#f343ff',
      name: 'Franta',
      tilesCount: 83,
    },
    receiver: {
      id: 0,
      pattern: '#fbc531',
      name: 'Trumpeta22',
      tilesCount: 80,
    },
  },
  {
    timeout: 0.3,
    sender: {
      id: 2,
      pattern: '#f34300',
      name: 'Adam',
      tilesCount: 10,
    },
    receiver: {
      id: 0,
      pattern: '#fbc531',
      name: 'Trumpeta22',
      tilesCount: 80,
    },
  },
  {
    timeout: 0.5,
    sender: {
      id: 0,
      pattern: '#fbc531',
      name: 'Trumpeta22',
      tilesCount: 80,
    },
    receiver: {
      id: 3,
      pattern: '#03c53f',
      name: 'matej1111',
      tilesCount: 203,
    },
  },
]

// const requests = []

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
  padding: 0px 30px 12px 30px;
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

  :hover {
    opacity: 0.9;
  }
`

const Diplomacy = ({ acceptRequest, declineRequest, sendRequest }) => {
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

  return (
    <Container ref={containerRef}>
      <Header
        text={ally ? 'Alliance' : 'Diplomacy'}
        iconSrc={playerSrc}
        iconSize="24px"
      />
      <Content>
        {ally ? (
          <Ally ally={ally} />
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
              onSend={sendRequest}
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
