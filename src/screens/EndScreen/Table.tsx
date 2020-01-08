import styled from 'styled-components'
import PlayerGroup from '../../types/PlayerGroup'
import React from 'react'
import { PRIMARY, STATIC } from '../../constants/react'

const Container = styled.div`
  margin: 0 auto;
  width: 320px;
`

const Header = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: space-between;
  color: #fff;
  font-weight: 500;
  padding: 0 16px;
`

const Group = styled.div`
  background: #fff;
  margin-top: 14px;
  border-radius: 4px;
  padding: 10px 16px;
  box-shadow: 0px 4px 16px #00000033;
`

interface NameAndTilesProps {
  opacity: number
}
const Player = styled.div`
  margin-top: 8px;

  :first-child {
    margin-top: 0;
  }

  p {
    font-weight: 500;

    :last-child {
      margin-left: auto;
    }
  }
`

const Pattern = styled.div`
  border-radius: 100%;
  width: 16px;
  height: 16px;
  background: ${props => props.color};
  margin-right: 8px;
  position: relative;
  top: 2px;
`

const Skull = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 8px;
  position: relative;
  top: 1px;
`

const NameAndTiles = styled.div<NameAndTilesProps>`
  display: flex;
  justify-content: space-between;
  opacity: ${props => props.opacity};
`

const ReasonOfDeath = styled.div`
  p {
    margin-top: 4px;
    text-align: left;
    font-size: 14px;
    font-style: italic;
    font-weight: 400;
    opacity: 0.8;
  }
  span {
    color: ${PRIMARY};
    font-style: normal;
    font-weight: 600;
    opacity: 1;
  }
`
interface Props {
  groups: PlayerGroup[]
}
const Table: React.FC<Props> = ({ groups }) => (
  <Container>
    <Header>
      <p>Player</p>
      <p>Tiles</p>
    </Header>

    {groups.map((group, index) => (
      <Group key={index}>
        {group.players.map(player => (
          <Player key={player.id}>
            <NameAndTiles opacity={player.alive ? 1 : 0.5}>
              {player.alive ? (
                <Pattern color={player.pattern} />
              ) : (
                <Skull src={`${STATIC}/icons/skull.svg`} />
              )}
              <p>{player.name}</p>
              <p>{player.alive ? player.tilesCount : '-'}</p>
            </NameAndTiles>
            <ReasonOfDeath>
              {player.killerName && (
                <p>
                  Killed by <span>{player.killerName}</span>
                </p>
              )}
              {!player.alive && !player.killerName && <p>Surrendered.</p>}
            </ReasonOfDeath>
          </Player>
        ))}
      </Group>
    ))}
  </Container>
)

export default Table
