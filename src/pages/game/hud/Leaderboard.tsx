import { observer } from 'mobx-react-lite'
import styled, { css } from 'styled-components'
import store from '../../../store'
import getPlayerGroups from '../../../utils/getPlayerGroups'
import React from 'react'
import { HUD_SCALE, CHAT_WIDTH } from '../../../constants/react'
import shadeColor from '../../../utils/shade'

const GridCSS = css`
  display: grid;
  grid-template-columns: auto 44px 44px 44px;
`

const Container = styled.div<{ spectating: boolean }>`
  background: rgba(255, 255, 255, 0.92);
  bottom: 0;
  right: ${props => (props.spectating ? CHAT_WIDTH : 0)};
  min-height: 240px;
  width: 320px;
  position: absolute;
  user-select: none;
  border-top-left-radius: 8px;
  border-top: 1px solid #ddd;
  border-left: 1px solid #ddd;
  overflow: hidden;

  /* Resolution scaling */
  transform-origin: right bottom;
  transform: scale(${HUD_SCALE});
`

const Icon = styled.img`
  height: 18px;
  opacity: 0.7;
  display: block;
  margin: 0 auto;
`

const Heading = styled.p`
  text-transform: uppercase;
  margin-top: 16px;
  margin-left: 16px;
  margin-bottom: 12px;
  margin-right: 16px;
  font-weight: 600;
  color: #333;
  font-size: 17px;

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
  border: 1px solid ${props => shadeColor(props.color, -10)};
`

const Skull = styled.img`
  height: 16px;
  width: 16px;
  margin-right: 8px;
  position: relative;
  top: -1px;
`

const Group = styled.div`
  background: #efefef;
  margin-top: 10px;
  border-top: 1px solid #ddd;
  border-bottom: 1px solid #ddd;

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
  }
`

const Leaderboard = observer(() => {
  if (store.players.length === 0) return null

  const groups = getPlayerGroups(store.players)

  return (
    <Container spectating={store.spectating}>
      <Heading>
        <span>Players</span>
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
              <p>{player.villages}</p>
              <p>{player.gold}</p>
            </Player>
          ))}
        </Group>
      ))}
    </Container>
  )
})

export default Leaderboard
