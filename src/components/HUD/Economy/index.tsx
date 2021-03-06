import styled from 'styled-components'
import { COLOR } from '../../../constants/constants-react'
import { observer } from 'mobx-react-lite'
import React from 'react'
import Chart from './Chart'
import getHudScale from '../../../utils/getHudScale'

const Economy = observer(() => (
  <Container>
    <ChartSection>
      <Chart />
    </ChartSection>
  </Container>
))

const Container = styled.div`
  background: ${COLOR.GREY_600};
  bottom: 0;
  left: 0;
  position: absolute;
  user-select: none;
  border-top-right-radius: 8px;
  border-top: 1px solid ${COLOR.GREY_800};
  border-right: 1px solid ${COLOR.GREY_800};
  overflow: hidden;

  /* Resolution scaling */
  transform-origin: left bottom;
  transform: scale(${getHudScale()});
`
const ChartSection = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: space-between;
`

export default Economy
