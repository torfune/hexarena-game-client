import styled, { css } from 'styled-components'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import { useEffect } from 'react'
import React from 'react'
import Api from '../../Api'
import { BREAKPOINT, PRIMARY } from '../../constants/react'
import shadeColor from '../../utils/shade'
import Heading from '../../components/Heading'

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

const List = styled.div`
  background: #282828;
  border: 1px solid #111;
  border-top: 0;
  border-bottom-left-radius: 4px;
  border-bottom-right-radius: 4px;
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
  padding: 10px 24px;
  font-weight: 400;
  background: #222;
  border: 1px solid #111;
  border-bottom: 1px solid #111;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  height: 40px;
  color: #aaa;
  max-width: 360px;
  min-width: 300px;
`

const PlayerRow = styled.div<{ highlight?: boolean }>`
  padding: 8px 24px;
  display: grid;
  grid-template-columns: 32px 1fr auto;

  ${props =>
    props.highlight
      ? css`
          background: ${shadeColor(PRIMARY, -10)};
          border-top: 1px solid #111;
          border-bottom: 1px solid #111;

          > p {
            color: #fff !important;
            font-weight: 500 !important;
          }
          > p:first-child {
            font-weight: 200 !important;
          }
        `
      : null}
`

const Name = styled.p<{ grey?: boolean }>`
  color: #eee;
  font-weight: 400;
`

const Number = styled.p`
  color: #aaa;
  font-weight: 200;
`

const Elo = styled.p`
  color: #eee;
  font-weight: 400;
`

const TopPlayers = () => {
  const { user } = store

  useEffect(() => {
    Api.ws.get(`/users/top-players`).then(response => {
      store.topPlayers = response.data
    })
  }, [])

  return (
    <Container>
      <Heading>Leaderboard</Heading>

      <ListHeading>
        <p>#</p>
        <p>Name</p>
        <p>ELO</p>
      </ListHeading>

      <List>
        {store.topPlayers.map((topPlayer, index) => (
          <PlayerRow
            key={index}
            highlight={!!user && topPlayer.name === user.name}
          >
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
