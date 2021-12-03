import styled, { css } from 'styled-components'
import React from 'react'
import { COLOR } from '../../constants/constants-react'
import store from '../../core/store'
import { observer } from 'mobx-react-lite'
import armyIcon from '../../icons/army.svg'
import villageIcon from '../../icons/village.svg'
import sortByKey from '../../utils/sortByKey'

const Charts = observer(() => {
  if (!store.game) return null

  const players = Array.from(store.game.players.values()).filter(
    (p) => p.alive && !p.surrendered
  )

  let totalEconomy = 0
  for (let i = 0; i < players.length; i++) {
    totalEconomy += players[i].economy
  }

  let chartItems: Array<{ color: string; fraction: number }> = []
  for (let i = 0; i < players.length; i++) {
    const player = players[i]
    chartItems.push({
      color: player.pattern,
      fraction: player.economy / totalEconomy,
    })
  }

  chartItems = sortByKey(chartItems, 'fraction')

  console.log(chartItems)

  return (
    <Container>
      <LabelRow>
        <Icon src={villageIcon} />
        <Label>Economy Comparison</Label>
      </LabelRow>

      <ChartBar>
        {store.game.mode.includes('1v1') && <IndicatorLine />}

        {chartItems.map((item) => (
          <ChartBarItem key={item.color} {...item} />
        ))}
      </ChartBar>

      {/*<LabelRow>*/}
      {/*  <Icon src={armyIcon} />*/}
      {/*  <Label>Military Comparison</Label>*/}
      {/*</LabelRow>*/}
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
  margin-bottom: 4px;
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
  display: flex;
  width: 234px;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
`
const ChartBarItem = styled.div<{ color: string; fraction: number }>`
  width: ${(props) => props.fraction * 234}px;
  background: ${(props) => props.color};
  height: 12px;
  border-right: 2px solid ${COLOR.GREY_600}ee;

  &:last-child {
    border: none;
  }
`
const IndicatorLine = styled.div`
  width: 2px;
  height: 12px;
  border-left: 2px solid #00000044;
  position: absolute;
  left: calc(50% - 1px);
`

export default Charts
