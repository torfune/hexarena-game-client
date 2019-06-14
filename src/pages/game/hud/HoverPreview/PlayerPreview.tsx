import styled from 'styled-components'
import React from 'react'
import shadeColor from '../../../../utils/shade'
import Player from '../../../../game/classes/Player'
import store from '../../../../store'

const Container = styled.div`
  padding-bottom: 8px;
  padding-left: 10px;
  padding-right: 12px;
  display: flex;
  align-items: center;
`

const Name = styled.h4`
  font-size: 18px;
  margin-left: 8px;
  font-weight: 600;
  margin-right: 16px;
`

const Icon = styled.img`
  height: 18px;
  opacity: 0.8;
  margin-right: 4px;
`

const Value = styled.p`
  font-size: 20px;
  margin-right: 16px;
  font-weight: 600;
  color: #333;
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
  border: 1px solid ${props => shadeColor(props.color, -10)};
`

interface Props {
  player: Player
}
const PlayerPreview: React.FC<Props> = ({ player }) => {
  return (
    <Container>
      {player.pattern === '#fff' ? (
        <Icon src="/static/icons/skull.svg" />
      ) : (
        <Pattern color={player.pattern} />
      )}
      <Name>{player.name}</Name>

      <Icon src="/static/icons/hexagon.svg" />
      <Value>{player.tilesCount}</Value>

      <Icon src="/static/icons/village.svg" />
      <Value>{player.villages}</Value>

      <Icon src="/static/icons/gold.svg" />
      <Value>{player.gold}</Value>
    </Container>
  )
}

export default PlayerPreview
