import React from 'react'
import styled from 'styled-components'
import crossSrc from '../../../../../assets/icons/cross.svg'
import checkSrc from '../../../../../assets/icons/check.svg'
import { observer } from 'mobx-react-lite'

const Container = styled.div``

const Item = styled.div`
  margin-top: 8px;
  padding: 8px 12px;
  border-radius: 2px;
  background: #efefef;
  display: flex;
  align-items: center;
  position: relative;

  :hover {
    background: ${props => (props.clickable ? '#ddd' : null)};
  }
`

const Pattern = styled.div`
  border-radius: 50%;
  background: ${props => props.color};
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

const Button = styled.div`
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
    width: ${props => props.iconSize};
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

const TimeoutBar = styled.div`
  position: absolute;
  width: ${props => `${props.timeout * 100}%`};
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

const List = ({
  players,
  requests,
  playerId,
  sendingRequest,
  onAccept,
  onDecline,
  onCreate,
}) => {
  if (sendingRequest) {
    players = players.filter(p => p.id !== playerId && !p.allyId && p.alive)

    return (
      <Container>
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
      </Container>
    )
  } else {
    return (
      <Container>
        {requests.received.map(({ timeout, sender }) => (
          <Item key={sender.id}>
            <Button
              iconSize="12px"
              onClick={() => {
                onAccept(sender.id)
              }}
            >
              <img src={checkSrc} alt="Accept" />
            </Button>
            <Button
              iconSize="10px"
              onClick={() => {
                onDecline(sender.id)
              }}
            >
              <img src={crossSrc} alt="Decline" />
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
      </Container>
    )
  }
}

export default observer(List)
