import React, { useEffect } from 'react'
import styled from 'styled-components'
import Label from './Label'
import { observer } from 'mobx-react-lite'
import store from '../../../../store'

const Container = styled.div`
  padding: 16px 20px;
  flex-grow: 1;
`

const IncomeBar = styled.canvas`
  height: 36px;
  width: 200px;
  margin-top: 12px;
  background: #ddd;
  border-radius: 4px;
  overflow: hidden;
`

const Income = () => {
  useEffect(() => {
    store.incomeStartedAt = Date.now() // - store.ping
  }, [store.lastIncomeAt])

  return (
    <Container>
      <Label>Next income</Label>
      <IncomeBar id="income-bar-fill" />
    </Container>
  )
}

export default observer(Income)
