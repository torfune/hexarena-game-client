import { observer } from 'mobx-react-lite'
import styled, { css } from 'styled-components'
import store from '../../core/store'
import getPlayerGroups from '../../utils/getPlayerGroups'
import React from 'react'
import { COLOR } from '../../constants/constants-react'
import getHudScale from '../../utils/getHudScale'
import goldIcon from '../../icons/gold.svg'
import hexagonIcon from '../../icons/hexagon.svg'
import villageIcon from '../../icons/village.svg'
import skullIcon from '../../icons/skull.svg'
import botIcon from '../../icons/bot.svg'
import Player from '../../core/classes/Player'

const Leaderboard = observer(() => {
  if (!store.game) return null

  let alivePlayers: Player[] = []
  let defeatedPlayers: Player[] = []
  for (const player of Array.from(store.game.players.values())) {
    if (player.alive && !player.surrendered) {
      alivePlayers.push(player)
    } else {
      defeatedPlayers.push(player)
    }
  }

  // Sort alive players
  alivePlayers.sort((a, b) => {
    return b.tilesCount - a.tilesCount
  })

  // Sort defeated players
  if (store.game.mode.includes('FFA')) {
    let newDefeatedPlayers: Player[] = []
    for (let i = 0; i < defeatedPlayers.length; i++) {
      const player = defeatedPlayers[i]
      if (player.place) {
        newDefeatedPlayers[player.place] = player
      }
    }
    defeatedPlayers = newDefeatedPlayers
  }

  return (
    <Container>
      <Heading>
        <span>Leaderboard</span>
        <Icon src={hexagonIcon} />
        <Icon src={villageIcon} />
        <Icon src={goldIcon} />
      </Heading>

      {alivePlayers.concat(defeatedPlayers).map((player, index) => (
        <PlayerRow key={player.id} opacity={player.alive ? 1 : 0.5}>
          <Row>
            <PlayerPlace>{player.place || index + 1}.</PlayerPlace>

            {player.surrendered && player.alive ? (
              <PlayerIcon src={botIcon} />
            ) : !player.alive ? (
              <PlayerIcon src={skullIcon} />
            ) : (
              <Pattern color={player.getPattern()} />
            )}

            <p>{player.name}</p>
          </Row>

          <PlayerValueText>{player.tilesCount}</PlayerValueText>
          <PlayerValueText>{player.economy}</PlayerValueText>
          <PlayerValueText>{player.gold}</PlayerValueText>
        </PlayerRow>
      ))}
    </Container>
  )
})

const GridCSS = css`
  display: grid;
  grid-template-columns: auto 44px 44px 44px;
`

const Container = styled.div`
  background: ${COLOR.GREY_600};
  bottom: 0;
  right: 0;
  min-height: 240px;
  width: 320px;
  position: absolute;
  user-select: none;
  border-top-left-radius: 8px;
  border-top: 1px solid ${COLOR.GREY_800};
  border-left: 1px solid ${COLOR.GREY_800};
  overflow: hidden;

  /* Resolution scaling */
  transform-origin: right bottom;
  transform: scale(${getHudScale()});
`

const Icon = styled.img`
  height: 12px;
  opacity: 0.5;
  display: block;
  margin: 0 auto;
  filter: invert(1);
`

const Heading = styled.p`
  text-transform: uppercase;
  margin: 16px 16px 12px 16px;
  font-weight: 600;
  color: #fff;
  opacity: 0.5;
  font-size: 12px;
  letter-spacing: 1px;

  ${GridCSS};
`

const Row = styled.div`
  display: flex;
  align-items: center;
`

const PlayerPlace = styled.div`
  color: #fff;
  margin-right: 8px;
  width: 14px;
`

interface PatternProps {
  color: string
}
const Pattern = styled.div<PatternProps>`
  height: 18px;
  width: 18px;
  border-radius: 6px;
  background: ${({ color }) => color};
  margin-right: 8px;
  position: relative;
  top: -1px;
  border: 1px solid ${COLOR.GREY_600};
`

const PlayerIcon = styled.img`
  height: 16px;
  width: 16px;
  margin-right: 8px;
  position: relative;
  top: -1px;
  filter: invert(1);
`

interface PlayerProps {
  opacity: number
}
const PlayerRow = styled.div<PlayerProps>`
  padding: 10px 16px;
  opacity: ${({ opacity }) => opacity};
  background: ${COLOR.GREY_800};
  margin-top: 10px;

  ${GridCSS};

  p {
    font-weight: 500;
    color: #fff;
  }
`

const PlayerValueText = styled.p`
  text-align: center;
`

export default Leaderboard
