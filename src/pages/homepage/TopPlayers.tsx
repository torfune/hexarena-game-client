import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import { useEffect } from 'react'
import TopPlayer from '../../types/TopPlayer'
import React from 'react'
import Api from '../../Api'

const Container = styled.div`
  height: 100%;
  margin-right: 64px;
`

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 32px;
`

const List = styled.div<{ fixedHeight?: string }>`
  background: #282828;
  border: 1px solid #111;
  border-top: 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
  padding-bottom: 16px;
  width: 320px;
  height: ${props => props.fixedHeight || 'auto'};
  overflow-y: auto;
  max-height: 830px;
  min-height: 400px;
`

const ListHeading = styled.div`
  width: 320px;
  display: grid;
  grid-template-columns: 32px 1fr auto;
  padding: 8px 24px;
  font-weight: 500;
  background: #222;
  border: 1px solid #111;
  border-bottom: 1px solid #111;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  color: #fff;
`

const PlayerRow = styled.div`
  padding: 8px 24px;
  display: grid;
  grid-template-columns: 32px 1fr auto;
`

const Value = styled.p`
  color: #fff;
  font-weight: 600;
  font-size: 20px;
`

interface Props {
  fixedHeight?: string
}
const TopPlayers: React.FC<Props> = ({ fixedHeight }) => {
  useEffect(() => {
    Api.ws.get(`/users/top-players`).then(response => {
      store.topPlayers = response.data
    })
  }, [])

  return (
    <Container>
      <Heading>Top 20 players</Heading>

      <ListHeading>
        <p>#</p>
        <p>Name</p>
        <p>ELO</p>
      </ListHeading>

      <List fixedHeight={fixedHeight}>
        {store.topPlayers.map((topPlayer, index) => (
          <PlayerRow key={topPlayer.id}>
            <Value>{index + 1}.</Value>
            <Value>{topPlayer.name}</Value>
            <Value>{topPlayer.elo.toLocaleString()}</Value>
          </PlayerRow>
        ))}
      </List>
    </Container>
  )
}

export default observer(TopPlayers)
