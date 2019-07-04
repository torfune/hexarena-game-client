import React, { useState, useEffect } from 'react'
import styled, { ThemeConsumer } from 'styled-components'
import Label from './Label'
import { Doughnut } from 'react-chartjs-2'
import { ChartData, ChartOptions } from 'chart.js'
import { observer } from 'mobx-react-lite'
import store from '../../../../store'

const Container = styled.div``

const PieWrapper = styled.div`
  margin-top: 16px;
`

const DATA: ChartData = {
  labels: ['rakec', 'META', 'Mate J'],
  datasets: [
    {
      data: [16, 12, 8],
      backgroundColor: ['#A3CB38', '#fa983a', '#ff6b6b'],
      borderWidth: 4,
    },
  ],
}

const OPTIONS: ChartOptions = {
  legend: {
    position: 'right',
    labels: {
      fontFamily: 'Montserrat',
      usePointStyle: true,
      fontSize: 14,
      fontColor: '#000',
      fontStyle: '500',
      padding: 8,
    },
  },
}

const Chart = () => {
  const [data, setData] = useState<ChartData | null>(null)

  useEffect(() => {
    const data: ChartData = {
      labels: store.players.map(p => p.name),
      datasets: [
        {
          data: store.players.map(p => p.economy),
          backgroundColor: store.players.map(p => p.pattern),
          borderWidth: 4,
        },
      ],
    }

    setData(data)

    // const economies: number[] = []

    // for (let i = 0; i < store.players.length; i++) {
    //   const { economy } = store.players[i]
    //   economies.push(economy)
    // }

    // console.log(economies)
  }, [store.economySum])

  // const data: ChartData = {
  //   labels: ['rakec', 'META', 'Mate J'],
  //   datasets: [
  //     {
  //       data: [16, 12, 8],
  //       backgroundColor: ['#A3CB38', '#fa983a', '#ff6b6b'],
  //       borderWidth: 4,
  //     },
  //   ],
  // }

  if (!data) return null

  return (
    <Container>
      <Label>Economy overview</Label>

      <PieWrapper>
        <Doughnut data={data} options={OPTIONS} height={140} width={300} />
      </PieWrapper>
    </Container>
  )
}

export default observer(Chart)
