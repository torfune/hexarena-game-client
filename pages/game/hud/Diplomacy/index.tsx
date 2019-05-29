import { observer } from 'mobx-react-lite'
import Ally from './Ally'
import List from './List'
import { Fragment, useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import Header from '../../../../components/Header'
import Label from '../../../../components/Label'
import store from '../../../../store'
import game from '../../../../game'
import { BLUE, PRIMARY } from '../../../../constants/react'

const Container = styled.div`
  z-index: 2;
  background: rgba(255, 255, 255, 0.92);
  bottom: 0;
  right: calc(256px * ${store.hudScale});
  width: 300px;
  position: absolute;
  user-select: none;
  border-top-left-radius: 8px;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  border-right: 1px solid #ddd;
  overflow: hidden;

  /* Resolution scaling */
  transform-origin: right bottom;
  transform: scale(${store.hudScale});
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

let flashInterval: NodeJS.Timeout

const Diplomacy = () => {
  const { players, player, allianceRequests } = store

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

  if (!player) return null

  const handleMouseLeave = () => {
    setSendingRequest(false)
  }

  const handleButtonClick = () => {
    setSendingRequest(!sendingRequest)
  }

  const handleCreate = (id: string) => {
    setSendingRequest(false)
    game.createRequest(id)
  }

  const handleAccept = (id: string) => {
    game.acceptRequest(id)
    setBlueHeader(false)
  }

  const handleDecline = (id: string) => {
    game.declineRequest(id)
  }

  const handleFlash = () => {
    let flash = false
    for (let i = 0; i < store.allianceRequests.length; i++) {
      if (store.allianceRequests[i].receiver.id === player.id) {
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
      <Header
        text={player.ally ? 'Alliance' : 'Diplomacy'}
        iconSrc="/static/icons/player.svg"
        iconSize="24px"
        color={blueHeader ? BLUE : undefined}
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
              color={sendingRequest ? PRIMARY : BLUE}
            >
              {sendingRequest ? 'Cancel' : 'Send request'}
            </ToggleButton>
          </Fragment>
        )}
      </Content>
    </Container>
  )
}

export default observer(Diplomacy)
