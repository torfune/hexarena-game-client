import React, { useEffect, useState, Fragment } from 'react'
import Api from '../Api'
import styled from 'styled-components'
import { PRIMARY } from '../constants/react'
import formatTime from '../utils/formatTime'
import FinishedGame from '../models/FinishedGame'
import Header from '../components/Header'
import store from '../store'
import { Link } from 'react-router-dom'
import { version } from '../../package.json'

const BackButton = styled.div`
  margin: 128px auto 48px auto;
  color: #fff;
  font-weight: 500;
  border-radius: 4px;
  font-size: 16px;
  display: flex;
  align-items: center;
  height: 40px;
  background: #222;
  width: 260px;
  border: 1px solid #111;
  padding-left: 16px;

  > img {
    height: 18px;
    margin-right: 12px;
    filter: invert(1);
  }

  :hover {
    background: #282828;
  }
`

interface SelectorProps {
  selected: 'YOUR_GAMES' | 'ALL_GAMES'
}
const Selector = styled.div`
  display: flex;
  width: 260px;
  margin: 48px auto;
  border: 1px #000 solid;
  border-radius: 42px;
  overflow: hidden;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
`

const YourGames = styled.div<SelectorProps>`
  background: ${props => (props.selected === 'YOUR_GAMES' ? PRIMARY : '#222')};
  width: 50%;
  text-align: center;
  padding: 8px 0;
  border-right: 1px #000 solid;
`
const AllGames = styled.div<SelectorProps>`
  background: ${props => (props.selected === 'ALL_GAMES' ? PRIMARY : '#222')};
  width: 50%;
  text-align: center;
  padding: 8px 0;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Game = styled.div`
  color: #fff;
  border: 1px solid #111;
  background: #222;
  border-radius: 8px;
  padding: 12px 24px;
  width: 260px;
  margin-bottom: 24px;
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
  padding: 4px 6px;
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

const Time = styled.p<{ grey?: boolean }>`
  color: ${props => (props.grey ? '#aaa' : '#fff')};
  margin-left: auto;
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

const MatchHistory = () => {
  const [games, setGames] = useState<FinishedGame[]>([])
  const [filter, setFilter] = useState<'YOUR_GAMES' | 'ALL_GAMES'>('YOUR_GAMES')

  if (!store.user) {
    return (
      <Fragment>
        <Header />
        <Link to="/">
          <BackButton>
            <img src={`/static/icons/castle.svg?${version}`} />
            Back to lobby
          </BackButton>
        </Link>
      </Fragment>
    )
  }

  const userId = store.user._id

  const getYourGames = async () => {
    setFilter('YOUR_GAMES')
    const { data } = await Api.ws.get(`/games/${userId}`)
    const games = data as FinishedGame[]
    setGames(games.reverse())
  }

  const getAllGames = async () => {
    setFilter('ALL_GAMES')
    const { data } = await Api.ws.get('/games')
    const games = data as FinishedGame[]
    setGames(games.reverse())
  }

  useEffect(() => {
    getYourGames()
  }, [])

  return (
    <Fragment>
      <Header />
      <Link to="/">
        <BackButton>
          <img src={`/static/icons/castle.svg?${version}`} />
          Back to lobby
        </BackButton>
      </Link>
      <Selector>
        <YourGames selected={filter} onClick={getYourGames}>
          YOUR GAMES
        </YourGames>
        <AllGames selected={filter} onClick={getAllGames}>
          ALL GAMES
        </AllGames>
      </Selector>
      <Container>
        {games.map(game => (
          <Game key={game._id}>
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
              {game.winners.map((winner, index) => (
                <Player key={index} opaque={!winner.alive}>
                  {winner.alive ? (
                    <>
                      <Pattern color={winner.pattern}>
                        <img src="/static/icons/crown.svg" />
                      </Pattern>
                      <Name>{winner.name}</Name>
                      <Elo red>(+{winner.eloChange})</Elo>
                    </>
                  ) : (
                    <>
                      <Skull src="/static/icons/skull.svg" />
                      <Name>{winner.name}</Name>
                      <Elo>({winner.eloChange})</Elo>
                    </>
                  )}
                </Player>
              ))}
              <Versus>
                <div />
                <p>VS</p>
                <div />
              </Versus>
              {game.losers.map((loser, index) => (
                <Player key={index} opaque={true}>
                  <>
                    <Skull src="/static/icons/skull.svg" />
                    <Name>{loser.name}</Name>
                    <Elo>({loser.eloChange})</Elo>
                  </>
                </Player>
              ))}
            </Players>
            <Row>
              <Time grey>
                {formatTime(
                  Math.round((game.finishedAt - game.startedAt) / 1000)
                )}
              </Time>
            </Row>
          </Game>
        ))}
      </Container>
    </Fragment>
  )
}

export default MatchHistory
