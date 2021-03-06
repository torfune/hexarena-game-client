import React from 'react'
import styled from 'styled-components'
import Label from './Label'
import { Doughnut } from 'react-chartjs-2'
import { observer } from 'mobx-react-lite'
import store from '../../../core/store'
import { COLOR } from '../../../constants/react'
import { ChartData, ChartOptions } from 'chart.js'

const Container = styled.div``

const ChartWrapper = styled.div`
  margin-top: 16px;
`

const OPTIONS: ChartOptions = {
  legend: {
    position: 'right',
    labels: {
      fontFamily: 'Montserrat',
      usePointStyle: true,
      fontSize: 14,
      fontColor: '#fff',
      fontStyle: '500',
      padding: 8,
    },
  },
}

const Chart = () => {
  if (!store.game) return null

  const players = Array.from(store.game.players.values()).filter(
    (player) => player.alive
  )
  const data: ChartData = {
    labels: players.map((p) => p.name),
    datasets: [
      {
        data: players.map((p) => p.economy),
        backgroundColor: players.map((p) => p.getPattern()),
        borderWidth: 1,
        borderColor: COLOR.GREY_600,
      },
    ],
  }

  return (
    <Container>
      <Label>Economy overview</Label>

      <ChartWrapper>
        <Doughnut data={data} options={OPTIONS} height={140} width={300} />
      </ChartWrapper>
    </Container>
  )
}

export default observer(Chart)
