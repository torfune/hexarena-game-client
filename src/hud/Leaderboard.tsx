import { observer } from 'mobx-react-lite'
import styled, { css } from 'styled-components'
import store from '../store'
import getPlayerGroups from '../utils/getPlayerGroups'
import React from 'react'
import { COLOR, BREAKPOINT } from '../constants/react'

const GridCSS = css`
  display: grid;
  grid-template-columns: auto 44px 44px 44px;
`

const Container = styled.div<{ spectating: boolean }>`
  background: ${COLOR.HUD_BACKGROUND};
  bottom: 0;
  right: 0;
  min-height: 240px;
  width: 320px;
  position: absolute;
  user-select: none;
  border-top-left-radius: 8px;
  border-top: 1px solid ${COLOR.HUD_BORDER};
  border-left: 1px solid ${COLOR.HUD_BORDER};
  overflow: hidden;

  /* Resolution scaling */
  transform-origin: right bottom;
  transform: scale(${store.hudScale});
`

const Icon = styled.img`
  height: 18px;
  opacity: 0.7;
  display: block;
  margin: 0 auto;
  filter: invert(1);
`

const Heading = styled.p`
  text-transform: uppercase;
  margin-top: 16px;
  margin-left: 16px;
  margin-bottom: 12px;
  margin-right: 16px;
  font-weight: 600;
  color: #ccc;
  font-size: 16px;

  ${GridCSS};
`

const Row = styled.div`
  display: flex;
  align-items: center;
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
  border: 1px solid ${COLOR.HUD_BACKGROUND};
`

const Skull = styled.img`
  height: 16px;
  width: 16px;
  margin-right: 8px;
  position: relative;
  top: -1px;
  filter: invert(1);
`

const Group = styled.div`
  background: #222;
  margin-top: 10px;
  border-top: 1px solid ${COLOR.HUD_BORDER};
  border-bottom: 1px solid ${COLOR.HUD_BORDER};

  :first-child {
    margin-top: 0;
  }

  p {
    text-align: center;
  }
`

interface PlayerProps {
  opacity: number
}
const Player = styled.div<PlayerProps>`
  padding: 10px 16px;
  opacity: ${({ opacity }) => opacity};

  ${GridCSS};

  p {
    font-weight: 500;
    color: #fff;
  }
`

const Leaderboard = observer(() => {
  if (!store.game) return null

  const groups = getPlayerGroups(Array.from(store.game.players.values()))

  return (
    <Container spectating={store.spectating}>
      <Heading>
        <span>Leaderboard</span>
        <Icon src="/static/icons/hexagon.svg" />
        <Icon src="/static/icons/village.svg" />
        <Icon src="/static/icons/gold.svg" />
      </Heading>

      {groups.map((group, index) => (
        <Group key={index}>
          {group.players.map(player => (
            <Player key={player.id} opacity={player.alive ? 1 : 0.5}>
              <Row>
                {player.alive ? (
                  <Pattern color={player.pattern} />
                ) : (
                  <Skull src="/static/icons/skull.svg" />
                )}

                <p>{player.name}</p>
              </Row>

              <p>{player.tilesCount}</p>
              <p>{player.economy}</p>
              <p>{player.gold}</p>
            </Player>
          ))}
        </Group>
      ))}
    </Container>
  )
})

export default Leaderboard
