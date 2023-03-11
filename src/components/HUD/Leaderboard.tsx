import { observer } from 'mobx-react-lite'
import styled, { css } from 'styled-components'
import store from '../../core/store'
import React from 'react'
import { COLOR } from '../../constants/constants-react'
import skullIcon from '../../icons/skull.svg'
import botIcon from '../../icons/bot.svg'
import Player from '../../core/classes/Player'
import getPlayerGroups from '../../utils/getPlayerGroups'
import formatMode from '../../utils/formatMode'

const Leaderboard = observer(() => {
  if (!store.game) return null

  let alivePlayers: Player[] = []
  let deadPlayers: Player[] = []
  for (const player of Array.from(store.game.players.values())) {
    if (player.alive && !player.surrendered) {
      alivePlayers.push(player)
    } else {
      deadPlayers.push(player)
    }
  }

  // Sort alive players
  alivePlayers.sort((a, b) => {
    return b.tilesCount - a.tilesCount
  })

  // Sort dead players
  if (store.game.mode.includes('FFA')) {
    let newDeadPlayers: Player[] = []
    for (let i = 0; i < deadPlayers.length; i++) {
      const player = deadPlayers[i]
      if (player.place) {
        newDeadPlayers[player.place] = player
      }
    }
    deadPlayers = newDeadPlayers
  }

  const teams = getPlayerGroups(Array.from(store.game.players.values()))

  return (
    <Container>
      <Heading>
        <span>LEADERBOARD</span>
        <span>{formatMode(store.game.mode)}</span>
      </Heading>

      {store.game.mode === '2v2'
        ? teams.map(({ players }, teamIndex) =>
            players.map((player, playerIndex) =>
              renderPlayer(player, teamIndex + 1, playerIndex === 0)
            )
          )
        : alivePlayers
            .concat(deadPlayers)
            .map((player, index) =>
              renderPlayer(player, player.place || index + 1, true)
            )}
    </Container>
  )
})

function renderPlayer(player: Player, place: number, divide: boolean) {
  if (!store.game) return null

  let name = player.name
  if (store.game.mode.includes('FFA') && player.alive) {
    name = '???'
  }

  return (
    <PlayerRow key={player.id} divide={divide}>
      <Row>
        <PlayerPlace>{place}.</PlayerPlace>

        {player.surrendered && player.alive ? (
          <PlayerIcon src={botIcon} />
        ) : !player.alive ? (
          <PlayerIcon src={skullIcon} />
        ) : (
          <Pattern color={player.getPattern()} />
        )}

        <p>{name}</p>
        <TileCount>({player.tilesCount})</TileCount>
      </Row>
    </PlayerRow>
  )
}

const Container = styled.div`
  background: ${COLOR.GREY_600}ee;
  bottom: 0;
  right: 0;
  position: absolute;
  user-select: none;
  border-top-left-radius: 4px;
  border-top: 1px solid ${COLOR.GREY_800};
  border-left: 1px solid ${COLOR.GREY_800};
  overflow: hidden;
  padding-bottom: 6px;
  min-width: 220px;
`
const Heading = styled.p`
  margin: 8px 8px 4px 8px;
  font-weight: 600;
  color: #fff;
  opacity: 0.5;
  font-size: 10px;
  letter-spacing: 1px;
  display: flex;
  justify-content: space-between;
`
const Row = styled.div`
  display: flex;
  align-items: center;
`
const PlayerPlace = styled.div`
  color: #fff;
  margin-right: 4px;
  width: 14px;
  font-size: 14px;
`
const Pattern = styled.div<{ color: string }>`
  height: 16px;
  width: 16px;
  border-radius: 50%;
  background: ${({ color }) => color};
  margin-right: 4px;
  position: relative;
  border: 1px solid ${COLOR.GREY_600};
`
const PlayerIcon = styled.img`
  height: 14px;
  width: 14px;
  margin-right: 4px;
  filter: invert(1);
`
const PlayerRow = styled.div<{ divide: boolean }>`
  padding: 8px 12px;
  background: ${COLOR.GREY_800};

  ${(props) =>
    props.divide &&
    css`
      margin-top: 6px;
    `}

  p {
    font-weight: 500;
    font-size: 14px;
    color: #fff;
  }
`
const TileCount = styled.p`
  margin-left: 4px;
  opacity: 0.5;
`

export default Leaderboard
