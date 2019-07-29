import styled from 'styled-components'
import React from 'react'
import shadeColor from '../../../../utils/shade'
import Player from '../../../../game/classes/Player'
import { COLOR } from '../../../../constants/react'

const Container = styled.div`
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 12px;
  padding-right: 12px;
  display: flex;
  align-items: center;
  background: ${COLOR.HUD_BACKGROUND};
  border: 1px solid ${COLOR.HUD_BORDER};
  border-radius: 8px;
`

const Name = styled.h4`
  font-size: 18px;
  margin-left: 8px;
  font-weight: 600;
  margin-right: 16px;
  color: #fff;
`

const Icon = styled.img`
  height: 18px;
  opacity: 0.8;
  margin-right: 4px;
  filter: invert(1);
`

const Value = styled.p`
  font-size: 20px;
  margin-right: 16px;
  font-weight: 600;
  color: #fff;
`

interface PatternProps {
  color: string
}
const Pattern = styled.div<PatternProps>`
  height: 20px;
  width: 20px;
  border-radius: 6px;
  background: ${({ color }) => color};
  position: relative;
  top: -1px;
  border: 1px solid ${COLOR.HUD_BORDER};
`

interface Props {
  player: Player
}
const PlayerPreview: React.FC<Props> = ({ player }) => (
  <Container>
    {player.pattern === '#ccc' ? (
      <Icon src="/static/icons/skull.svg" />
    ) : (
      <Pattern color={player.pattern} />
    )}
    <Name>{player.name}</Name>

    <Icon src="/static/icons/hexagon.svg" />
    <Value>{player.tilesCount}</Value>

    <Icon src="/static/icons/village.svg" />
    <Value>{player.economy}</Value>

    <Icon src="/static/icons/gold.svg" />
    <Value>{player.gold}</Value>
  </Container>
)

export default PlayerPreview
