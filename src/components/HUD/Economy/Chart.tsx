import React from 'react'
import styled from 'styled-components'
import Label from './Label'
import { Bar } from 'react-chartjs-2'
import { observer } from 'mobx-react-lite'
import store from '../../../core/store'
import { ChartData, ChartOptions } from 'chart.js'
import { COLOR } from '../../../constants/constants-react'

const CHART_WIDTH = 360
const CHART_HEIGHT = 150

const CHART_OPTIONS: ChartOptions = {
  legend: { display: false },
  scales: {
    yAxes: [
      {
        ticks: {
          suggestedMin: 0,
          beginAtZero: true,
          fontFamily: 'Montserrat',
          fontStyle: '600',
          fontColor: 'rgba(255, 255, 255, 0.5)',
        },
        gridLines: {
          color: COLOR.GREY_800,
        },
      },
    ],
    xAxes: [
      {
        ticks: {
          fontColor: '#fff',
          fontFamily: 'Montserrat',
          fontStyle: '600',
        },
        gridLines: {
          color: COLOR.GREY_800,
        },
      },
    ],
  },
}

const Chart = () => {
  if (!store.game) return null

  const players = Array.from(store.game.players.values()).filter(
    (player) => player.alive
  )
  players.sort((a, b) => {
    return b.economy - a.economy
  })

  const data: ChartData = {
    labels: players.map((p) => p.name),
    datasets: [
      {
        data: players.map((p) => p.economy),
        backgroundColor: players.map((p) => p.getPattern()),
        maxBarThickness: 64,
      },
    ],
  }

  return (
    <Container>
      <Label>Economy comparison</Label>

      <ChartWrapper>
        <Bar
          data={data}
          options={CHART_OPTIONS}
          height={CHART_HEIGHT}
          width={CHART_WIDTH}
        />
      </ChartWrapper>
    </Container>
  )
}

const Container = styled.div``

const ChartWrapper = styled.div`
  margin-top: 16px;
`

export default observer(Chart)
