import styled, { css } from 'styled-components'
import React from 'react'
import { COLOR } from '../../constants/constants-react'
import store from '../../core/store'
import { observer } from 'mobx-react-lite'
import villageIcon from '../../icons/village.svg'
import sortByKey from '../../utils/sortByKey'

const Charts = observer(() => {
  if (!store.game) return null

  const players = Array.from(store.game.players.values()).filter(
    (p) => p.alive && !p.surrendered
  )

  let highestEconomy = 0
  for (let i = 0; i < players.length; i++) {
    if (players[i].economy > highestEconomy) {
      highestEconomy = players[i].economy
    }
  }

  let chartItems: Array<{ color: string; fraction: number; text: string }> = []
  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    chartItems.push({
      color: player.pattern,
      fraction: player.economy / highestEconomy,
      text: (store.game.mode.includes('FFA') && player.alive) ? '???' : player.name,
    })
  }

  chartItems = sortByKey(chartItems, 'fraction')

  return (
    <Container>
      <LabelRow>
        <Icon src={villageIcon} />
        <Label>Economy Comparison</Label>
      </LabelRow>

      <ChartBar>
        {chartItems.map((item) => (
          <ChartBarItem key={item.color} {...item}>
            {item.text}
          </ChartBarItem>
        ))}
      </ChartBar>
    </Container>
  )
})

const Container = styled.div`
  background: ${COLOR.GREY_600}ee;
  top: 0;
  right: 0;
  width: 250px;
  position: absolute;
  user-select: none;
  border-bottom-left-radius: 4px;
  border-bottom: 1px solid ${COLOR.GREY_800};
  border-left: 1px solid ${COLOR.GREY_800};
  overflow: hidden;
  padding: 8px;
`
const LabelRow = styled.div`
  display: flex;
  margin-top: 16px;
  margin-bottom: 6px;
  align-items: center;

  &:first-child {
    margin-top: 0;
  }
`
const Icon = styled.img`
  filter: invert(1);
  height: 9px;
  margin-right: 4px;
  opacity: 0.5;
`
const Label = styled.p`
  text-transform: uppercase;
  font-weight: 600;
  font-size: 10px;
  letter-spacing: 1px;
  color: #fff;
  opacity: 0.5;
`
const ChartBar = styled.div`
  position: relative;
`
const ChartBarItem = styled.div<{ color: string; fraction: number }>`
  width: ${(props) => props.fraction * 234}px;
  background: ${(props) => props.color};
  border-radius: 2px;
  margin-bottom: 4px;
  padding: 1px 4px;
  color: ${(props) => (props.fraction > 0.15 ? COLOR.GREY_600 : 'transparent')};
  font-size: 10px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;

  &:last-child {
    margin-bottom: 0;
  }
`

export default Charts
