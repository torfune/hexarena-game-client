import styled from 'styled-components'
import { COLOR } from '../../../constants/react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import Income from './Income'
import Gold from './Gold'
import Chart from './Chart'
import store from '../../../store'
import getHudScale from '../../../utils/getHudScale'

const Container = styled.div`
  background: ${COLOR.HUD_BACKGROUND};
  bottom: 0;
  left: 0;
  min-height: 240px;
  position: absolute;
  user-select: none;
  border-top-right-radius: 8px;
  border-top: 1px solid ${COLOR.HUD_BORDER};
  border-right: 1px solid ${COLOR.HUD_BORDER};
  overflow: hidden;

  /* Resolution scaling */
  transform-origin: left bottom;
  transform: scale(${getHudScale()});
`

const GoldSection = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${COLOR.HUD_BORDER};
`

const ChartSection = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
`

const Economy = observer(() => (
  <Container>
    {!store.spectating && (
      <GoldSection>
        <Income />
        <Gold />
      </GoldSection>
    )}

    <ChartSection>
      <Chart />
    </ChartSection>
  </Container>
))

export default Economy
