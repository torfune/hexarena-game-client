import React, { useEffect, Fragment } from 'react'
import styled from 'styled-components'
import formatTime from '../../utils/formatTime'
import { PRIMARY, BREAKPOINT } from '../../constants/react'
import store from '../../store'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'
import Timer from '../../components/Timer'

const Container = styled.div`
  color: #fff;
  padding-top: calc(48px + 80px);
  height: 0;

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

const RankedBox = styled.div`
  background: ${PRIMARY};
  padding: 4px;
  border-radius: 2px;
`

const Balance = styled.p<{ ranked: boolean }>`
  font-size: 14px;
  font-weight: 600;
  color: ${props => (props.ranked ? '#fff' : '#aaa')};
`

const Players = styled.div`
  padding: 8px 0;
  margin: 8px 0;
  border-top: 1px solid #666;
  border-bottom: 1px solid #666;
  margin-bottom: 16px;
`

const Group = styled.div``

const Versus = styled.div`
  display: flex;
  align-items: center;

  div {
    height: 1px;
    background: #666;

    :nth-child(1) {
      width: 30px;
    }
    :nth-child(3) {
      width: 190px;
    }
  }

  p {
    font-size: 20px;
    font-weight: 700;
    color: ${PRIMARY};
    letter-spacing: -3px;
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
  useEffect(() => {
    store.fetchRunningGames()
    store.fetchFinishedGames()
  }, [])

  return (
    <Container>
      <Heading>Games</Heading>
      {store.runningGames.length > 0 && (
        <>
          <SectionHeading>RUNNING</SectionHeading>
          {store.runningGames.map(game => (
            <Game key={game.id}>
              <Row>
                <Mode>{game.mode}</Mode>
                {game.ranked ? (
                  <RankedBox>
                    <Balance ranked={game.ranked}>RANKED</Balance>
                  </RankedBox>
                ) : (
                  <Balance ranked={game.ranked}>NORMAL</Balance>
                )}
              </Row>
              <Players>
                {game.players.map((group, index) => (
                  <Fragment key={index}>
                    {index > 0 && (
                      <Versus>
                        <div />
                        <p>VS</p>
                        <div />
                      </Versus>
                    )}
                    {runningPlayerGroup(group)}
                  </Fragment>
                ))}
              </Players>
              <Row>
                <Link to={`/spectate?game=${game.id}`}>
                  <SpectateButton>
                    <img src="/static/icons/spectate.svg" />
                    Spectate
                  </SpectateButton>
                </Link>

                <Timer finishesAt={game.finishesAt} />
              </Row>
            </Game>
          ))}
        </>
      )}
      {store.finishedGames.length > 0 && (
        <>
          <SectionHeading>FINISHED</SectionHeading>
          {store.finishedGames.map(game => (
            <Game key={game.id}>
              <Row>
                <Mode>{game.mode}</Mode>
                {game.ranked ? (
                  <RankedBox>
                    <Balance ranked={game.ranked}>RANKED</Balance>
                  </RankedBox>
                ) : (
                  <Balance ranked={game.ranked}>NORMAL</Balance>
                )}
              </Row>
              <Players>
                {game.players.map((group, index) => (
                  <Fragment key={index}>
                    {index > 0 && (
                      <Versus>
                        <div />
                        <p>VS</p>
                        <div />
                      </Versus>
                    )}
                    {finishedPlayerGroup(group)}
                  </Fragment>
                ))}
              </Players>
              <Row>
                <Time grey>{formatTime(game.time)}</Time>
              </Row>
            </Game>
          ))}
        </>
      )}
    </Container>
  )
}

const runningPlayerGroup = (
  players: Array<{
    name: string
    elo: number | null
    pattern: string
    alive: boolean
  }>
) => (
  <Group>
    {players.map((p, index) => (
      <Player key={index} opaque={!p.alive}>
        {p.alive ? (
          <Pattern color={p.pattern} />
        ) : (
          <Skull src="/static/icons/skull.svg" />
        )}

        <Name>{p.name}</Name>
        {p.elo && <Elo>({p.elo})</Elo>}
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

export default observer(GameList)
