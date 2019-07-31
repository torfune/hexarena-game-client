import React from 'react'
import styled from 'styled-components'
import formatTime from '../../utils/formatTime'
import { PRIMARY, BREAKPOINT } from '../../constants/react'
import RunningGames from './RunningGames'

// const RUNNING_GAMES = [
//   {
//     id: 'aaaa',
//     mode: '2v2',
//     balanced: true,
//     time: 5,
//     players: [
//       [
//         {
//           name: 'Mate J',
//           elo: 1231,
//           pattern: '#fbc531',
//         },
//         {
//           name: 'rakec',
//           elo: 1402,
//           pattern: '#ff6b6b',
//         },
//       ],
//       [
//         {
//           name: 'Kata',
//           elo: 1456,
//           pattern: '#0abde3',
//         },
//         {
//           name: 'Slamm',
//           elo: 1312,
//           pattern: '#fa983a',
//         },
//       ],
//     ],
//   },
//   {
//     id: 'bbbb',
//     mode: '1v1',
//     balanced: false,
//     time: 500,
//     players: [
//       [
//         {
//           name: 'rakec',
//           elo: 1500,
//           pattern: '#fbc531',
//         },
//       ],
//       [
//         {
//           name: 'Kata',
//           elo: 1456,
//           pattern: '#0abde3',
//         },
//       ],
//     ],
//   },
// ]

// const FINISHED_GAMES = [
//   {
//     id: 'aaaa',
//     mode: '2v2',
//     balanced: true,
//     time: 123,
//     players: [
//       [
//         {
//           name: 'Matej Strnad',
//           eloChange: 31,
//           pattern: '#fbc531',
//         },
//         {
//           name: 'rakec',
//           eloChange: -12,
//           pattern: '#ff6b6b',
//         },
//       ],
//       [
//         {
//           name: 'Kata',
//           eloChange: -21,
//           pattern: '#0abde3',
//         },
//         {
//           name: 'Slamm',
//           eloChange: -22,
//           pattern: '#fa983a',
//         },
//       ],
//     ],
//   },
//   {
//     id: 'bbbb',
//     mode: '1v1',
//     balanced: false,
//     time: 500,
//     players: [
//       [
//         {
//           name: 'Matej Strnad',
//           eloChange: 32,
//           pattern: '#fbc531',
//         },
//       ],
//       [
//         {
//           name: 'Kata',
//           eloChange: -32,
//           pattern: '#0abde3',
//         },
//       ],
//     ],
//   },
// ]

const Container = styled.div`
  color: #fff;
  padding-top: calc(48px + 80px);

  @media (max-width: ${BREAKPOINT.HIDE_CHAT}) {
    margin-right: 48px;
  }

  @media (max-width: ${BREAKPOINT.FINAL}) {
    margin-right: 0px;
    padding-top: 64px;
  }
`

const Heading = styled.h2`
  font-size: 28px;
  font-weight: 500;
`

const SectionHeading = styled.p`
  margin-top: 32px;
  font-size: 16px;
  font-weight: 600;
  color: #aaa;
`

const Game = styled.div`
  color: #fff;
  border: 1px solid #111;
  background: #222;
  border-radius: 8px;
  padding: 12px 24px;
  width: 260px;
  margin-top: 16px;
  margin-bottom: 32px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Mode = styled.p`
  font-size: 24px;
  font-weight: 600;
`

const Balance = styled.p`
  font-size: 14px;
  font-weight: 600;
  color: #aaa;
`

const Players = styled.div`
  padding: 8px 0;
  margin: 8px 0;
  border-top: 1px solid #aaa;
  border-bottom: 1px solid #aaa;
  margin-bottom: 16px;
`

const Group = styled.div``

const Versus = styled.div`
  display: flex;
  align-items: center;

  div {
    height: 1px;
    background: #aaa;

    :nth-child(1) {
      width: 30px;
    }
    :nth-child(3) {
      width: 190px;
    }
  }

  p {
    font-size: 10px;
    font-weight: 600;
    margin: 0 8px;
  }
`

const Player = styled.div<{ opaque?: boolean }>`
  display: flex;
  align-items: center;
  margin: 8px 0;
  opacity: ${props => (props.opaque ? 0.6 : 1)};
`

const Name = styled.p`
  font-weight: 600;
  margin-left: 8px;
`

const Elo = styled.p<{ red?: boolean }>`
  font-weight: ${props => (props.red ? 600 : 400)};
  margin-left: 8px;
  color: ${props => (props.red ? PRIMARY : '#aaa')};
`

const Pattern = styled.div<{ color: string }>`
  border-radius: 6px;
  border: 1px solid #111;
  background: ${props => props.color};
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 16px;
    opacity: 0.8;
  }
`

const Skull = styled.img`
  width: 22px;
  filter: invert(1);
`

const SpectateButton = styled.div`
  background: #333;
  border: 1px solid #111;
  padding: 2px 0;
  border-radius: 8px;
  font-weight: 500;
  width: 140px;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    background: #3f3f3f;
  }

  img {
    height: 26px;
    filter: invert(1);
    margin-right: 10px;
  }
`

const Time = styled.p<{ grey?: boolean }>`
  color: ${props => (props.grey ? '#aaa' : '#fff')};
  margin-left: auto;
`

const GameList = () => {
  return (
    <Container>
      <Heading>Games</Heading>
      <SectionHeading>RUNNING</SectionHeading>

      <RunningGames />

      {/* {RUNNING_GAMES.map(game => (
        <Game key={game.id}>
          <Row>
            <Mode>{game.mode}</Mode>
            <Balance>{game.balanced ? 'BALANCED' : 'RANDOM'}</Balance>
          </Row>
          <Players>
            {runningPlayerGroup(game.players[0])}
            <Versus>
              <div />
              <p>VS</p>
              <div />
            </Versus>
            {runningPlayerGroup(game.players[1])}
          </Players>
          <Row>
            <SpectateButton>
              <img src="/static/icons/spectate.svg" />
              Spectate
            </SpectateButton>
            <Time>{formatTime(game.time)}</Time>
          </Row>
        </Game>
      ))}
      <SectionHeading>FINISHED</SectionHeading>
      {FINISHED_GAMES.map(game => (
        <Game key={game.id}>
          <Row>
            <Mode>{game.mode}</Mode>
            <Balance>{game.balanced ? 'BALANCED' : 'RANDOM'}</Balance>
          </Row>
          <Players>
            {finishedPlayerGroup(game.players[0])}
            <Versus>
              <div />
              <p>VS</p>
              <div />
            </Versus>
            {finishedPlayerGroup(game.players[1])}
          </Players>
          <Row>
            <Time grey>{formatTime(game.time)}</Time>
          </Row>
        </Game>
      ))} */}
    </Container>
  )
}

const runningPlayerGroup = (
  players: Array<{ name: string; elo: number; pattern: string }>
) => (
  <Group>
    {players.map((p, index) => (
      <Player key={index}>
        <Pattern color={p.pattern} />
        <Name>{p.name}</Name>
        <Elo>({p.elo})</Elo>
      </Player>
    ))}
  </Group>
)

const finishedPlayerGroup = (
  players: Array<{ name: string; eloChange: number; pattern: string }>
) => (
  <Group>
    {players.map((p, index) => (
      <Player key={index} opaque={p.eloChange < 0}>
        {p.eloChange > 0 ? (
          <>
            <Pattern color={p.pattern}>
              <img src="/static/icons/crown.svg" />
            </Pattern>
            <Name>{p.name}</Name>
            <Elo red>(+{p.eloChange})</Elo>
          </>
        ) : (
          <>
            <Skull src="/static/icons/skull.svg" />
            <Name>{p.name}</Name>
            <Elo>({p.eloChange})</Elo>
          </>
        )}
      </Player>
    ))}
  </Group>
)

export default GameList
