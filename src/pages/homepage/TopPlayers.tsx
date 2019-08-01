import styled from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import { useEffect } from 'react'
import TopPlayer from '../../types/TopPlayer'
import React from 'react'
import Api from '../../Api'
import { BREAKPOINT } from '../../constants/react'

const Container = styled.div`
  grid-column: 1;
  grid-row: 1 / span 3;

  @media (max-width: ${BREAKPOINT.MAIN_2}) {
    margin-top: 80px;
    grid-row: 3;
  }

  @media (max-width: ${BREAKPOINT.HIDE_CHAT}) {
    margin-top: 0;
    grid-row: 1 / span 3;
  }

  @media (max-width: ${BREAKPOINT.MAIN_4}) {
    display: none;
  }

  @media (max-width: ${BREAKPOINT.FINAL}) {
    display: block;
    grid-column: 1;
    grid-row: auto;
    margin-top: 64px;
  }
`

const Heading = styled.h2`
  font-size: 28px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 32px;
`

const List = styled.div`
  background: #282828;
  border: 1px solid #111;
  border-top: 0;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
  padding-top: 8px;
  padding-bottom: 8px;
  width: 100%;
  max-width: 360px;
  min-width: 300px;
`

const ListHeading = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 32px 1fr auto;
  padding: 8px 24px;
  font-weight: 500;
  background: #222;
  border: 1px solid #111;
  border-bottom: 1px solid #111;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  color: #fff;
  max-width: 360px;
  min-width: 300px;
`

const PlayerRow = styled.div`
  padding: 8px 24px;
  display: grid;
  grid-template-columns: 32px 1fr auto;
`

const Name = styled.p<{ grey?: boolean }>`
  color: #fff;
  font-weight: 600;
`

const Number = styled.p`
  color: #aaa;
  font-weight: 500;
`

const Elo = styled.p`
  color: #aaa;
  font-weight: 500;
`

const TopPlayers = () => {
  useEffect(() => {
    Api.ws.get(`/users/top-players`).then(response => {
      store.topPlayers = response.data
    })
  }, [])

  return (
    <Container>
      <Heading>Top {store.topPlayers.length} players</Heading>

      <ListHeading>
        <p>#</p>
        <p>Name</p>
        <p>ELO</p>
      </ListHeading>

      <List>
        {store.topPlayers.map((topPlayer, index) => (
          <PlayerRow key={index}>
            <Number>{index + 1}.</Number>
            <Name>{topPlayer.name}</Name>
            <Elo>{topPlayer.elo.toLocaleString()}</Elo>
          </PlayerRow>
        ))}
      </List>
    </Container>
  )
}

export default observer(TopPlayers)
