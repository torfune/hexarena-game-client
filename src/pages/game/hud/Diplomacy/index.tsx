import { observer } from 'mobx-react-lite'
import List from './List'
import { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Label from '../../../../components/Label'
import store from '../../../../store'
import { BLUE, PRIMARY, HUD_SCALE, COLOR } from '../../../../constants/react'
import React from 'react'

const Container = styled.div`
  z-index: 2;
  background: ${COLOR.HUD_BACKGROUND};
  bottom: 0;
  right: calc(319px * ${HUD_SCALE});
  width: 300px;
  position: absolute;
  user-select: none;
  border-top-left-radius: 8px;
  border-top: 1px solid ${COLOR.HUD_BORDER};
  border-left: 1px solid ${COLOR.HUD_BORDER};
  border-right: 1px solid ${COLOR.HUD_BORDER};
  overflow: hidden;

  /* Resolution scaling */
  transform-origin: right bottom;
  transform: scale(${HUD_SCALE});
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  align-items: center;
  transition: 100ms;

  h2 {
    margin-top: 2px;
    text-transform: uppercase;
    color: #ccc;
    font-size: 16px;
    font-weight: 600;
  }
`

const Content = styled.div`
  padding: 0 16px;
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

let flashInterval: NodeJS.Timeout

const Diplomacy = () => {
  const [sendingRequest, setSendingRequest] = useState(false)
  const [blueHeader, setBlueHeader] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const blueHeaderRef = useRef<boolean>(blueHeader)
  blueHeaderRef.current = blueHeader

  useEffect(() => {
    if (containerRef && containerRef.current) {
      containerRef.current.addEventListener('mouseleave', handleMouseLeave)
      flashInterval = setInterval(handleFlash, 500)
    }

    return () => {
      if (containerRef && containerRef.current) {
        containerRef.current.removeEventListener('mouseleave', handleMouseLeave)
        clearInterval(flashInterval)
      }
    }
  }, [])

  if (!store.game || !store.game.player) return null

  const { player } = store.game
  const players = Object.values(store.game.players)
  const allianceRequests = Object.values(store.game.allianceRequests)

  const handleMouseLeave = () => {
    setSendingRequest(false)
  }

  const handleButtonClick = () => {
    setSendingRequest(!sendingRequest)
  }

  const handleCreate = (id: string) => {
    if (!store.game) return
    setSendingRequest(false)
    store.game.createRequest(id)
  }

  const handleAccept = (id: string) => {
    if (!store.game) return
    store.game.acceptRequest(id)
    setBlueHeader(false)
  }

  const handleDecline = (id: string) => {
    if (!store.game) return
    store.game.declineRequest(id)
  }

  const handleFlash = () => {
    let flash = false
    for (let i = 0; i < allianceRequests.length; i++) {
      if (allianceRequests[i].receiver.id === player.id) {
        flash = true
        break
      }
    }

    if (flash) {
      setBlueHeader(!blueHeaderRef.current)
    } else {
      setBlueHeader(false)
    }
  }

  const requests = {
    sent: allianceRequests.filter(r => r.sender.id === player.id),
    received: allianceRequests.filter(r => r.receiver.id === player.id),
  }

  return (
    <Container ref={containerRef}>
      <Header color={blueHeader ? BLUE : undefined}>
        <h2>Diplomacy</h2>
      </Header>
      <Content>
        <Label>{sendingRequest ? 'Select player' : 'Alliance requests'}</Label>
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
          color={sendingRequest ? PRIMARY : BLUE}
        >
          {sendingRequest ? 'Cancel' : 'Send request'}
        </ToggleButton>
      </Content>
    </Container>
  )
}

export default observer(Diplomacy)
