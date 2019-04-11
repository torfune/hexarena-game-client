import React from 'react'
import styled from 'styled-components'
import skull from '../../../../../assets/icons/skull.svg'

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

const Player = styled.div`
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

const Table = ({ groups }) => (
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
              <Skull src={skull} />
            )}

            <p>{player.name}</p>
            <p>{player.tilesCount}</p>
          </Player>
        ))}
      </Group>
    ))}
  </Container>
)

export default Table
