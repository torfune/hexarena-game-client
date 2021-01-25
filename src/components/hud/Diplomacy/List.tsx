import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import Player from '../../../core/classes/Player'
import AllianceRequest from '../../../core/classes/AllianceRequest'
import React from 'react'
import checkIcon from '../../../icons/check.svg'
import crossIcon from '../../../icons/cross.svg'

interface Props {
  players: Player[]
  requests: {
    sent: AllianceRequest[]
    received: AllianceRequest[]
  }
  playerId: string
  sendingRequest: boolean
  onAccept: (id: string) => void
  onDecline: (id: string) => void
  onCreate: (id: string) => void
}
const List = ({
  players,
  requests,
  playerId,
  sendingRequest,
  onAccept,
  onDecline,
  onCreate,
}: Props) => {
  if (sendingRequest) {
    players = players.filter((p) => p.id !== playerId && !p.allyId && p.alive)

    return (
      <div>
        {players.length > 0 ? (
          players.map(({ id, name, pattern }) => (
            <Item
              key={pattern}
              clickable={true}
              onClick={() => {
                onCreate(id)
              }}
            >
              <Pattern color={pattern} />
              <Name>{name}</Name>
            </Item>
          ))
        ) : (
          <NoPlayersText>Every player is already in alliance</NoPlayersText>
        )}
      </div>
    )
  } else {
    return (
      <div>
        {requests.received.map(({ timeout, sender }) => (
          <Item key={sender.id}>
            <Button
              iconSize="12px"
              onClick={() => {
                onAccept(sender.id)
              }}
            >
              <img src={checkIcon} alt="Accept" />
            </Button>
            <Button
              iconSize="10px"
              onClick={() => {
                onDecline(sender.id)
              }}
            >
              <img src={crossIcon} alt="Decline" />
            </Button>

            <Line />

            <Pattern color={sender.pattern} />
            <Name>{sender.name}</Name>

            <TimeoutBar timeout={timeout} />
          </Item>
        ))}

        {requests.sent.map(({ timeout, receiver }) => (
          <Item key={receiver.id}>
            <Waiting>request sent</Waiting>

            <Line />

            <Pattern color={receiver.pattern} />
            <Name>{receiver.name}</Name>

            <TimeoutBar timeout={timeout} />
          </Item>
        ))}
      </div>
    )
  }
}

interface ItemProps {
  clickable?: boolean
}
const Item = styled.div<ItemProps>`
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 2px;
  background: #efefef;
  display: flex;
  align-items: center;
  position: relative;

  :hover {
    background: ${(props) => (props.clickable ? '#ddd' : null)};
  }
`

const Pattern = styled.div`
  border-radius: 50%;
  background: ${(props) => props.color};
  width: 20px;
  height: 20px;
  margin-left: 8px;
`

const Name = styled.p`
  margin-left: 8px;
`

const Waiting = styled.p`
  font-style: italic;
  font-size: 12px;
  line-height: 0.95;
  color: #666;
  width: 60px;
  text-align: center;
`

interface ButtonProps {
  iconSize: string
}

const Button = styled.div<ButtonProps>`
  border-radius: 50%;
  width: 24px;
  height: 24px;
  background: #fff;
  border: 1px solid #888;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 6px;

  img {
    width: ${(props) => props.iconSize};
    opacity: 0.7;
  }

  :hover {
    background: #222;
    border-color: #222;

    img {
      filter: invert(1);
      opacity: 1;
    }
  }
`

const Line = styled.div`
  width: 1px;
  height: 28px;
  background: #ccc;
  margin-left: 4px;
  margin-right: 2px;
`

interface TimeoutBarProps {
  timeout: number
}

const TimeoutBar = styled.div<TimeoutBarProps>`
  position: absolute;
  width: ${(props) => `${props.timeout * 100}%`};
  transition: 0.2s;
  bottom: 0;
  left: 0;
  background: #888;
  height: 2px;
`

const NoPlayersText = styled.p`
  font-style: italic;
  font-size: 14px;
  color: #666;
  margin-top: 12px;
  text-align: center;
`

export default observer(List)
