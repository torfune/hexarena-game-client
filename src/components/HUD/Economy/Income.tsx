import React from 'react'
import styled from 'styled-components'
import Label from './Label'
import { observer } from 'mobx-react-lite'
import { COLOR } from '../../../constants/react'

const Container = styled.div`
  padding: 16px 20px;
  flex-grow: 1;
`

const IncomeBar = styled.canvas`
  height: 36px;
  width: 200px;
  margin-top: 12px;
  background: ${COLOR.GREY_200};
  border-radius: 4px;
  overflow: hidden;
`

const Income = () => (
  <Container>
    <Label>Next income</Label>
    <IncomeBar id="income-bar-fill" />
  </Container>
)

export default observer(Income)
