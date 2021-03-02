import styled from 'styled-components'
import React from 'react'
import Player from '../../../core/classes/Player'
import { COLOR } from '../../../constants/react'
import store from '../../../core/store'
import skullIcon from '../../../icons/skull.svg'
import isSpectating from '../../../utils/isSpectating'

interface Props {
  player: Player
}
const PlayerPreview: React.FC<Props> = ({ player }) => {
  const ally = store.game && store.game.playerId === player.allyId

  return (
    <Container>
      {player.pattern === '#ccc' ? (
        <Icon src={skullIcon} />
      ) : (
        <Pattern color={player.pattern} />
      )}
      <Name>{player.name}</Name>
      {!isSpectating() && (
        <AllyOrEnemy background={ally ? COLOR.BLUE : COLOR.RED}>
          {ally ? 'ALLY' : 'ENEMY'}
        </AllyOrEnemy>
      )}
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  background: ${COLOR.GREY_600};
  border: 1px solid ${COLOR.GREY_800};
  border-radius: 8px;
  padding: 8px 12px;
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

interface PatternProps {
  color: string
}
interface AllyOrEnemyProps {
  background: string
}
const Pattern = styled.div<PatternProps>`
  height: 20px;
  width: 20px;
  border-radius: 6px;
  background: ${({ color }) => color};
  position: relative;
  border: 1px solid ${COLOR.GREY_800};
`
const AllyOrEnemy = styled.div<AllyOrEnemyProps>`
  background: ${({ background }) => background};
  color: #fff;
  padding: 2px 6px;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 600;
`

export default PlayerPreview
