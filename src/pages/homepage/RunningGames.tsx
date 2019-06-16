import styled from 'styled-components'
import React from 'react'
import { observer } from 'mobx-react-lite'
import store from '../../store'
import Pattern from '../../components/Pattern'
import { Link } from 'react-router-dom'

const Container = styled.div`
  margin-top: 96px;
  color: #fff;
`

const Heading = styled.h2`
  font-size: 32px;
  font-weight: 500;
`

const GamesContainer = styled.div`
  display: flex;
  margin-top: 32px;
  flex-wrap: wrap;
`

const Game = styled.div`
  border: 1px solid #282828;
  width: 200px;
  border-radius: 4px;
  margin-right: 24px;
  margin-bottom: 24px;

  /* Head */
  > div:nth-child(1) {
    background: #2f2f2f;
    padding: 8px 16px;

    /* Game ID */
    h2 {
      font-size: 16px;
      font-weight: 500;
    }
  }

  /* Body */
  > div:nth-child(2) {
    background: #323232;
    padding: 12px 16px;
  }

  /* Spectate button */
  button {
    background: #383838;
    border: 1px solid #282828;
    padding: 6px 12px;
    margin-top: 16px;
    border-radius: 2px;
    font-size: 16px;
    font-weight: 500;
    width: 100%;
    color: #fff;
    display: flex;
    align-items: center;

    :hover {
      background: #3f3f3f;
    }

    img {
      height: 22px;
      filter: invert(1);
      margin-right: 12px;
    }
  }
`

const Player = styled.div<{ opaque: boolean }>`
  margin: 16px 0;
  display: flex;
  opacity: ${props => (props.opaque ? 0.6 : 1)};

  /* Name */
  p {
    margin-top: -1px;
    font-weight: 500;
    font-size: 18px;
    margin-left: 8px;
  }

  /* Skull icon */
  img {
    height: 18px;
    filter: invert(1);
  }
`

const RunningGames: React.FC = () => {
  const { runningGames } = store

  if (runningGames.length === 0) return null

  return (
    <Container>
      <Heading>Running games</Heading>

      <GamesContainer>
        {runningGames.map(game => (
          <Game key={game.id}>
            <div>
              <h2>Game #{Number(game.id)}</h2>
            </div>
            <div>
              {game.players.map((player, index) => (
                <Player key={index} opaque={!player.alive}>
                  {player.alive ? (
                    <Pattern color={player.pattern} />
                  ) : (
                    <img src="/static/icons/skull.svg" />
                  )}
                  <p>{player.name}</p>
                </Player>
              ))}

              <Link to={`/spectate?gameIndex=${game.id}`}>
                <button>
                  <img src="/static/icons/spectate.svg" />
                  <p>Spectate</p>
                </button>
              </Link>
            </div>
          </Game>
        ))}
      </GamesContainer>
    </Container>
  )
}

export default observer(RunningGames)
