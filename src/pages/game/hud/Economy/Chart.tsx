import React, { useState, useEffect } from 'react'
import styled, { ThemeConsumer } from 'styled-components'
import Label from './Label'
import { Doughnut } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'
import { observer } from 'mobx-react-lite'
import store from '../../../../store'
import { COLOR } from '../../../../constants/react'

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
  // const [data, setData] = useState<ChartData | null>(null)

  // useEffect(() => {
  // if (!store.game) return

  // setData(data)
  // }, [store.economy])

  if (!store.game) return null

  const players = Object.values(store.game.players)
  const data: ChartData = {
    labels: players.map(p => p.name),
    datasets: [
      {
        data: players.map(p => p.houses),
        backgroundColor: players.map(p => p.pattern),
        borderWidth: 1,
        borderColor: COLOR.HUD_BACKGROUND,
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
