import styled from 'styled-components'
import PlayerGroup from '../../../../types/PlayerGroup'
import React from 'react'

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

interface PlayerProps {
  opacity: number
}
const Player = styled.div<PlayerProps>`
  display: flex;
  margin: 8px 0;
  opacity: ${props => props.opacity};

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
  display: inline-block;
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

const PlayerNameAndStatus = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
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
          <Player key={player.id} opacity={player.alive ? 1 : 0.5}>
            {player.alive ? (
              <Pattern color={player.pattern} />
            ) : (
              <Skull src="/static/icons/skull.svg" />
            )}
            <PlayerNameAndStatus>
              <p>{player.name}</p>
              {player.killerName && <p>killed by {player.killerName}</p>}
              {!player.alive && !player.killerName && <p>surrendered</p>}
            </PlayerNameAndStatus>
            <p>{player.alive ? player.tilesCount : '-'}</p>
          </Player>
        ))}
      </Group>
    ))}
  </Container>
)

export default Table
