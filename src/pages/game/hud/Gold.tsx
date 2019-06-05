import { observer } from 'mobx-react-lite'
import styled from 'styled-components'
import store from '../../../store'
import { useState, useEffect } from 'react'
import React from 'react'
import { HUD_SCALE } from '../../../constants/react'

const Container = styled.div`
  background: rgba(255, 255, 255, 0.92);
  border-bottom-right-radius: 12px;
  border: 1px solid #ddd;
  border-left: none;
  border-top: none;
  position: absolute;
  top: 0;
  user-select: none;
  transform-origin: left top;
  transform: scale(${HUD_SCALE});
  padding: 12px 16px;
  display: grid;
  grid-template-columns: 40px 80px 40px 100px 40px auto;
  grid-column-gap: 8px;
  grid-row-gap: 12px;
`

const Label = styled.p<{ column: string }>`
  text-transform: uppercase;
  font-size: 16px;
  font-weight: 600;
  grid-row: 1;
  color: #444;
  grid-column: ${props => props.column} / span 2;
`

const Icon = styled.img<{ column: string; size: string; marginTop?: string }>`
  height: ${props => props.size};
  grid-column: ${props => props.column};
  margin-top: ${props => props.marginTop};
  opacity: 0.8;
`

const Count = styled.div<{ top: number }>`
  font-size: 34px;
  color: #222;
  position: absolute;
  top: ${props => props.top}px;
  transition: 500ms;
  width: 64px;
  line-height: 44px;
`

const CountMask = styled.div`
  position: relative;
  height: 44px;
  width: 64px;
  overflow: hidden;
`

const VillageCount = styled.p`
  font-size: 34px;
  color: #222;
  position: relative;
  top: -2px;
`

const numbers: number[] = []
for (let i = 0; i <= 50; i++) {
  numbers.push(i)
}

const BASE_TOP = -3
const ROW_HEIGHT = 44

const GoldSection = () => {
  const [goldTop, setGoldTop] = useState(BASE_TOP)

  useEffect(() => {
    const top = BASE_TOP + store.gold * ROW_HEIGHT * -1
    setGoldTop(top)
  }, [store.gold])

  if (!store.villages || !store.player) return null

  return (
    <Container>
      <Label column="1">Tiles</Label>
      <Label column="3">Villages</Label>
      <Label column="5">Gold</Label>

      <Icon
        column="1"
        size="28px"
        marginTop="3px"
        src="/static/icons/hexagon.svg "
      />
      <VillageCount>{store.player.tilesCount}</VillageCount>

      <Icon
        column="3"
        size="28px"
        marginTop="3px"
        src="/static/icons/village.svg "
      />
      <VillageCount>
        {!store.villages.current && !store.villages.limit
          ? '0'
          : `${store.villages.current}/${store.villages.limit}`}
      </VillageCount>

      <Icon
        column="5"
        size="28px"
        marginTop="4px"
        src="/static/icons/gold.svg "
      />
      <CountMask>
        <Count top={goldTop}>
          {numbers.map(number => (
            <p key={number}>{number}</p>
          ))}
        </Count>
      </CountMask>
    </Container>
  )
}

export default observer(GoldSection)
