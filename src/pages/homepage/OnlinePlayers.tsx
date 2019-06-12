import { observer } from 'mobx-react-lite'
import store from '../../store'
import styled from 'styled-components'
import React from 'react'

const Container = styled.div`
  margin-top: 96px;
  color: #fff;
`

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 500;
`

const OnlinePlayersContainer = styled.div`
  display: flex;
  margin-top: 16px;
  flex-wrap: wrap;
`

const OnlinePlayer = styled.div`
  background: #2f2f2f;
  border: 1px solid #282828;
  padding: 8px 16px;
  margin-right: 8px;
  border-radius: 4px;
  margin-bottom: 8px;

  > h2 {
    font-weight: 500;
    font-size: 18px;
  }

  > p {
    font-weight: 300;
    color: #eee;
    margin-top: 4px;
    text-align: right;
  }
`

const OnlinePlayers = () => {
  const { onlinePlayers } = store

  if (onlinePlayers.length === 0) return null

  return (
    <Container>
      <Heading>Online players</Heading>

      <OnlinePlayersContainer>
        {onlinePlayers.map(onlinePlayer => (
          <OnlinePlayer key={onlinePlayer.id}>
            <h2>{onlinePlayer.name}</h2>
            <p>{onlinePlayer.status}</p>
          </OnlinePlayer>
        ))}
      </OnlinePlayersContainer>
    </Container>
  )
}

export default observer(OnlinePlayers)
